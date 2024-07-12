'use client'

import { useState } from 'react'
import { type Note } from '@prisma/client'
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/solid'

import { Main, Title } from '@/components/ui'
import Footer, { FooterListItem } from '@/components/ui/footer'
import { saveNote } from '@/server/queries'

export default function Note({ note }: { note: Note }) {
  const [body, setBody] = useState(note.body)
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
        {/* <FooterListItem
        onClick={() => {
          refetch().catch(err => console.log(err))
        }}
      >
        <ArrowPathIcon
          className={classnames('h-6 w-6', isRefetching && 'animate-spin-slow')}
        />
      </FooterListItem>
      {mode === 'text' ? (
        <FooterListItem onClick={() => setMode('list')}>
          <ListBulletIcon className='h-6 w-6' />
        </FooterListItem>
      ) : (
        <FooterListItem onClick={() => setMode('text')}>
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
      </FooterListItem> */}
        <FooterListItem
          onClick={async () => {
            if (note) {
              const newNote = {
                ...note,
                text: `${note?.title ?? ''}\n\n${body}`,
                body,
              }
              await saveNote(newNote)
            }
          }}
          disabled={body === note?.body}
        >
          <ArrowDownOnSquareIcon className='h-6 w-6' />
        </FooterListItem>
      </Footer>
    </>
  )
}
