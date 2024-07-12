import { Main, Title } from '@/components/ui'
import Note from './_components/Note'
import { getNote } from '@/server/queries'

export default async function Home() {
  const note = await getNote(process.env.NOTE_ID!)
  if (!note) {
    return (
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col items-center justify-center space-y-4'>
          <Title>chomps</Title>
        </div>
      </Main>
    )
  }
  return <Note note={note} />
}
