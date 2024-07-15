'use client'

import { useState, useEffect } from 'react'
import { type Note } from '@prisma/client'
import {
  DocumentDuplicateIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import { useDebounce } from '@uidotdev/usehooks'
import { toast } from 'react-toastify'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from '@clerk/nextjs'

import { Main, Title } from '@/components/ui'
import Footer, { FooterListItem } from '@/components/ui/footer'
import { saveNote } from '@/server/queries'
import useLocalStorage from '@/lib/useLocalStorage'
import copyToClipboard from '@/lib/copyToClipboard'
import DragDropList from '@/components/ui/dragDropList'

export default function Note({ note }: { note: Note }) {
  const { isSignedIn } = useAuth()
  const [mode, setMode] = useLocalStorage<'text' | 'list'>('dlp-mode', 'text')
  const [body, setBody] = useState(note.body)
  const debouncedBody = useDebounce(body, 500)

  useEffect(() => {
    async function updateNote() {
      const newNote = {
        ...note,
        text: `${note?.title ?? ''}\n\n${body}`,
        body,
      }
      await saveNote(newNote)
    }
    if (isSignedIn) {
      void updateNote()
    }
  }, [debouncedBody])

  const textAsList = (body ?? '').split('\n')
  return (
    <>
      <Main className='flex flex-col space-y-4 p-4'>
        <div className='relative'>
          <Title>chomps</Title>
          <div className='absolute right-0 top-0'>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        {mode === 'list' && isSignedIn ? (
          <div className='space-y-3'>
            <DragDropList
              items={textAsList
                // .filter(item => item)
                .map((item, index) => ({ id: `${item}-${index}`, item }))}
              renderItem={({ item }: { item: string }, index: number) => (
                <div key={index} className='rounded-lg bg-cobalt p-3'>
                  {index + 1}. {item}
                </div>
              )}
              setItems={newItems => {
                setBody(newItems.map(({ item }) => item).join('\n'))
              }}
              listContainerClassName='space-y-3'
            />
          </div>
        ) : (
          <textarea
            className='h-full w-full flex-grow bg-cobalt disabled:border-none disabled:opacity-75'
            value={body}
            onChange={e => setBody(e.target.value)}
            disabled={!isSignedIn}
          />
        )}
      </Main>
      <Footer>
        {mode === 'text' ? (
          <FooterListItem
            onClick={() => setMode('list')}
            disabled={!isSignedIn}
          >
            <ListBulletIcon className='h-6 w-6' />
          </FooterListItem>
        ) : (
          <FooterListItem
            onClick={() => setMode('text')}
            disabled={!isSignedIn}
          >
            <PencilSquareIcon className='h-6 w-6' />
          </FooterListItem>
        )}
        <FooterListItem
          onClick={() => {
            copyToClipboard(body)
            toast.success('copied to clipboard')
          }}
        >
          <DocumentDuplicateIcon className='h-6 w-6' />
        </FooterListItem>
      </Footer>
    </>
  )
}
