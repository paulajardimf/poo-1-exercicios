import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/BaseDatabase";
import { TVideoDB } from "./types";
import { Video } from "./models/Video";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const q = req.query.q;
    let videosDB;

    if (q) {
      const result: TVideoDB[] = await db("videos").where(
        "name",
        "LIKE",
        `%${q}%`
      );
      videosDB = result;
    } else {
      const result: TVideoDB[] = await db("videos");
      videosDB = result;
    }

    const videos: Video[] = videosDB.map(
      (videoDB) =>
        new Video(
          videoDB.id,
          videoDB.title,
          videoDB.duration,
          videoDB.upload_at
        )
    );
    res.status(200).send(videos);

  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/videos", async (req: Request, res: Response) => {
  try {
    const {id, title, duration} = req.body

    if (typeof id !== "string") {
      res.status(400)
      throw new Error("'id' deve ser uma string")
    }

    if (typeof title !== "string") {
      res.status(400)
      throw new Error("'title' deve ser uma string")
    }

    if (typeof duration !== "number") {
      res.status(400)
      throw new Error("'duration' deve ser number")
    }

    const [videoDBExist]: TVideoDB[] | undefined[] = await db("videos").where({id})

    if (videoDBExist) {
      res.status(400)
      throw new Error("'id' já existe")
    }

    const newVideo = new Video (
      id,
      title,
      duration,
      new Date().toISOString()
    )

    const newVideoDB: TVideoDB = {
      id: newVideo.getId(),
      title: newVideo.getTitle(),
      duration: newVideo.getDuration(),
      upload_at: newVideo.getUploadAt()
    }

    await db("videos").insert(newVideoDB)

    res.status(200).send(newVideo)

  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/videos/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const {title, duration} = req.body

    const [videoBD] : TVideoDB[] | undefined[] = await db("videos").where({id});

    if (!videoBD) {
      res.status(400)
      throw new Error ("'id' não encontrado")
    }

    if (typeof title !== "string") {
      res.status(400)
      throw new Error("'title' deve ser uma string")
    }

    if (typeof duration !== "number") {
      res.status(400)
      throw new Error("'duration' deve ser um number")
    }

    const videoToEdit = new Video (
      videoBD.id,
      title || videoBD.title,
      duration || videoBD.duration,
      videoBD.upload_at
    )
    console.log(videoToEdit);

    const updateVideoDB : TVideoDB = {
      id: videoToEdit.getId(),
      title: videoToEdit.getTitle(),
      duration: videoToEdit.getDuration(),
      upload_at: videoToEdit.getUploadAt()
    }

    await db("videos").update(updateVideoDB).where({id})
    res.status(200).send({videoAtualizado: videoToEdit})

  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.delete("/videos/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    const [videoInDB] : TVideoDB[] | undefined[] = await db("videos").where({id})

    if(!videoInDB) {
      res.status(400)
      throw new Error ("Vídeo não encontrado!")
    }

    const videoToDelete = new Video (
      videoInDB.id,
      videoInDB.title,
      videoInDB.duration,
      videoInDB.upload_at,
    )
    await db("videos").del().where({id})

    res.status(200).send({message: "Vídeo deletado com sucesso!", video: videoToDelete})

  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
