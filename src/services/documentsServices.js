import { v4 as uuidv4 } from "uuid";
import { prisma } from "../plugins/prisma.js";

export async function findMany() {
  return await prisma.documents.findMany()
}

export async function findUnique(id) {
  return await prisma.documents.findUnique({
    where: { id }
  })
}

export async function create(body) {
  return await prisma.documents.create({
    data: {
      id: uuidv4(),
      ...body
    }
  })
}

export async function deletee(id) {
  return await prisma.documents.delete({
    where: { id }
  })
}

export async function update(id, body) {
  return await prisma.documents.update({
    where: { id },
    data: {
      ...body,
      updated_at: new Date()
    }
  })
}