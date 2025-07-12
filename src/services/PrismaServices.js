import { v4 as uuidv4 } from "uuid";
import { prisma } from "../plugins/prisma.js";

export async function findyMany() {
  return await prisma.documents.findMany({
    orderBy: {
      updated_at: 'desc'
    }
  });
}

export async function findUnique(id) {
  return await prisma.documents.findUnique({
    where: { id },
  });
}

export async function create(body) {
  return await prisma.documents.create({
    data: {
      id: uuidv4(),
      ...body,
    },
  });
}

export async function update(id,body) {
  return await prisma.documents.update({
    where: { id },
    data: {
      ...body,
      updated_at: new Date(),
    },
  });
}

export async function delette(id) {
  return await prisma.documents.delete({
    where: { id }
  })
}

export async function search(q) {
  return await prisma.documents.findMany({
    where: {
      OR: [
        { title: {contains: q, mode: "insensitive"} },
        { content: { contains: q, mode: "insensitive"} },
        { category: { contains: q, mode: "insensitive"}},
        { author: { contains: q, mode: "insensitive"} }
      ]
    }
  })
}
