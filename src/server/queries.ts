'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

import { db } from './db'

export async function getNote(id: string) {
  try {
    const note = await db.note.findFirstOrThrow({
      where: {
        id,
      },
    })
    return note
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function saveNote(note: {
  id?: string
  text?: string
  title?: string
  body?: string
  author: string
}) {
  const user = auth()

  if (!user.userId) throw new Error('Unauthorized')

  const fullUser = await clerkClient.users.getUser(user.userId)

  if (!fullUser?.privateMetadata?.['can-edit']) {
    throw new Error('user does not have edit permission')
  }

  const text = note.text ?? 'untitled\nbody'
  const title = note.title ?? 'untitled'

  const newNote = {
    text,
    title,
    body: note.body ?? 'body',
    author: note.author,
  }

  try {
    return await db.note.upsert({
      where: {
        id: note.id ?? '',
      },
      update: newNote,
      create: newNote,
    })
  } catch (error) {
    console.log(error)
  }
}
