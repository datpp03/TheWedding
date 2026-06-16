import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MEDIA_PROCESSING_STATUS } from '@the-wedding/shared';
import { JobsOptions, Queue, Worker, type ConnectionOptions } from 'bullmq';
import { Repository } from 'typeorm';
import { MediaProcessingProcessor } from '../application/media-processing.processor';
import { MediaProcessingJob, MediaProcessingService } from '../domain/media-processing-service';
import { MediaOrmEntity } from './media.orm-entity';

const QUEUE_NAME = 'media-processing';
const JOB_OPTIONS: JobsOptions = {
  attempts: 3,
  backoff: { delay: 5_000, type: 'exponential' },
  removeOnComplete: 500,
  removeOnFail: 1_000,
};

@Injectable()
export class BullMqMediaProcessingService implements MediaProcessingService, OnModuleDestroy {
  private readonly queue?: Queue<MediaProcessingJob>;
  private readonly worker?: Worker<MediaProcessingJob>;

  constructor(
    private readonly config: ConfigService,
    private readonly processor: MediaProcessingProcessor,
    @InjectRepository(MediaOrmEntity)
    private readonly media: Repository<MediaOrmEntity>,
  ) {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) return;

    const connection: ConnectionOptions = { maxRetriesPerRequest: null, url: redisUrl };
    this.queue = new Queue<MediaProcessingJob>(QUEUE_NAME, { connection });
    this.worker = new Worker<MediaProcessingJob>(
      QUEUE_NAME,
      async (job) => this.processor.process(job.data),
      {
        concurrency: this.config.get<number>('MEDIA_PROCESSING_CONCURRENCY', 2),
        connection,
      },
    );
  }

  async enqueue(job: MediaProcessingJob): Promise<void> {
    await this.media.update(job.mediaId, {
      processingFailureReason: null,
      processingStatus: MEDIA_PROCESSING_STATUS.PENDING,
      updatedAt: new Date(),
    });
    if (this.queue) {
      await this.queue.add('process-media', job, {
        ...JOB_OPTIONS,
        jobId: job.mediaId,
      });
      return;
    }

    setImmediate(() => {
      void this.processor.process(job).catch(() => undefined);
    });
  }

  async retry(mediaId: string): Promise<void> {
    const media = await this.media.findOne({ where: { id: mediaId } });
    if (!media) return;
    await this.enqueue({
      mediaId: media.id,
      mimeType: media.mimeType,
      storageKey: media.storageKey,
      tenantId: media.tenantId,
      type: media.type,
    });
  }

  async onModuleDestroy() {
    await this.worker?.close();
    await this.queue?.close();
  }
}
