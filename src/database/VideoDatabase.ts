import { TVideoDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";


export class VideoDatabase extends BaseDatabase{
  public static TABLE_VIDEOS = "videos"

  public async findVideos(q: string | undefined) {
    let videosDB;

    if (q) {
      const result: TVideoDB[] = await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .where(
        "name",
        "LIKE",
        `%${q}%`
      );
      videosDB = result;
    } else {
      const result: TVideoDB[] = await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS);

      videosDB = result;
    }
    return videosDB
  }

  public async findVideoById(id: string) {
    const [videoDB]: TVideoDB[] | undefined[] = await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .where({id})

    return videoDB
  }

  public async insertVideo(newVideoDB: TVideoDB) {
    await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .insert(newVideoDB)
  }

  public async UpdateVideoById(id: string, updateVideoDB: TVideoDB){
    await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .update(updateVideoDB)
      .where({id})
  }

  public async DeleteVideoById(id: string) {
    await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)
    .del()
    .where({id})
  }
}