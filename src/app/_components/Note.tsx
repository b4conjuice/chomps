'use client'

import { useState, useEffect } from 'react'
import { type Note } from '@prisma/client'
import {
  DocumentDuplicateIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import { useDebounce } from '@uidotdev/usehooks'

import { Main, Title } from '@/components/ui'
import Footer, { FooterListItem } from '@/components/ui/footer'
import { saveNote } from '@/server/queries'
import useLocalStorage from '@/lib/useLocalStorage'
import copyToClipboard from '@/lib/copyToClipboard'

export default function Note({ note }: { note: Note }) {
  const [mode, setMode] = useLocalStorage<'text' | 'list'>('dlp-mode', 'text')
  const [body, setBody] = useState(note.body)
  const debouncedBody = useDebounce(body, 500)

  useEffect(() => {
    async function updateNote() {
      if (note) {
        const newNote = {
          ...note,
          text: `${note?.title ?? ''}\n\n${body}`,
          body,
        }
        await saveNote(newNote)
      }
    }
    void updateNote()
  }, [debouncedBody])
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col items-center justify-center space-y-4'>
          <Title>chomps</Title>
          <textarea
            className='h-full w-full flex-grow bg-cobalt'
            value={body}
            onChange={e => setBody(e.target.value)}
          />
        </div>
      </Main>
      <Footer>
        {/* {mode === 'text' ? (
          <FooterListItem onClick={() => setMode('list')}>
            <ListBulletIcon className='h-6 w-6' />
          </FooterListItem>
        ) : (
          <FooterListItem onClick={() => setMode('text')}>
            <PencilSquareIcon className='h-6 w-6' />
          </FooterListItem>
        )} */}
        <FooterListItem
          onClick={() => {
            copyToClipboard(body)
            // toast.success('copied to clipboard')
          }}
        >
          <DocumentDuplicateIcon className='h-6 w-6' />
        </FooterListItem>
      </Footer>
    </>
  )
}
