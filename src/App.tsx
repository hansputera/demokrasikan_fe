import { SentFormJSX } from "./components/sentForm"

function App() {
  return (
    <>
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">
            <a href="https://ngl.sman3palu.sch.id/" class="hover:text-red-300 text-red-500 uppercase">
                suara demokrasi
              </a>
            </h1>
            <p class="py-6">
              Mau menyampaikan suaramu ke seseorang atau saran dan kritik sekolah? Sampaikan disini!
            </p>

            <SentFormJSX />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
