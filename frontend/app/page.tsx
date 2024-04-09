import NotesPicker from '@/components/NotePicker'
import Notes from '@/components/Notes'

export default function Home() {
  return (
    <main className="bg-slate-100 w-full min-h-screen pb-10 flex flex-col items-center justify-center">
      <div className="w-96 border-solid border border-slate-200 ">

      <NotesPicker />
      {/* <Notes /> */}

      </div>
    </main>
  )
}
