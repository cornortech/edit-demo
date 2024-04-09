import NotesPicker from '@/components/NotePicker'
//import Notes from '@/components/Notes'
import Page from '@/components/Chardiff'
export default function Home() {
  return (
    <div className="bg-slate-100 w-full min-h-screen pb-10 flex flex-col items-center justify-center">
      <div className="w-96 border-solid border border-slate-200 ">

      <NotesPicker />
      {/* <Notes /> */}
       <Page/>
      </div>
     
    </div>
  )
}
