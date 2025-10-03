// import type { IEventsRepository } from '@/application/repositories/events.repository.interface';
// import { insertEventSchema } from '@/entities/models/event';
// import type { Event } from '@/entities/models/event';
// import { join, dirname } from 'path';
// import { fileURLToPath } from 'url';
// import { promises as fs } from 'fs';

// const LOG_DIR = process.env.EVENT_LOG_DIR ?? '.data';
// const LOG_FILE = process.env.EVENT_LOG_FILE ?? 'event-logs.jsonl';

// // resolve to project root
// const cwd = process.cwd();
// const filePath = join(cwd, LOG_DIR, LOG_FILE);

// export class EventsRepositoryFile implements IEventsRepository {
//     private nextId = 1;
//     private initialized = false;

//     private async ensureFile() {
//         if (this.initialized) return;
//         await fs.mkdir(dirname(filePath), { recursive: true });
//         try {
//             await fs.access(filePath);
//         } catch {
//             await fs.writeFile(filePath, '');
//         }
//         this.initialized = true;
//     }

//     async create(input: unknown): Promise<Event> {
//         await this.ensureFile();
//         const dto = insertEventSchema.parse(input);
//         const row: Event = {
//             id: this.nextId++,
//             userId: dto.userId,
//             sessionId: dto.sessionId,
//             actionName: dto.actionName,
//             loggedAt: dto.loggedAt ?? new Date(),
//             problemId: dto.problemId,
//             methodId: dto.methodId,
//             stepId: dto.stepId,
//             payload: dto.payload,
//         };
//         // write as JSON Lines (1 event per line)
//         await fs.appendFile(
//             filePath,
//             JSON.stringify({ ...row, loggedAt: row.loggedAt.toISOString() }) +
//                 '\n',
//             'utf8',
//         );
//         return row;
//     }
// }
