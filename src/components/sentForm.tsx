import { Show, createSignal } from "solid-js"
import { twMerge } from "tailwind-merge";

export const SentFormJSX = () => {
    const [kategori, setKategori] = createSignal<string>('');
    const [target, setTarget] = createSignal<string>('');
    const [pesan, setPesan] = createSignal<string>('');
    const [tipe, setTipe] = createSignal<string>('');
    const [destination, setDestination] = createSignal<string>('');
    const [useRandomName, setRandomCondition] = createSignal<boolean>(false);
    const [apiData, setApiData] = createSignal<{
        loading: boolean;
        error?: string;
        message?: string;
    }>({
        loading: false,
        error: undefined,
        message: undefined,
    });

    const submitHandle = () => {
        setApiData({
            loading: true,
            message: undefined,
        });

        if (kategori() === 'menfess') {
            fetch(`https://kritikapi.sman3palu.sch.id/menfess/${target()}/${destination().trim()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({message: pesan().trim(), randomName: useRandomName()}),
            }).then(r => r.json()).then(r => {
                if (r.message) {
                    setApiData({
                        error: r.message,
                        loading: false,
                    });
                    return;
                }

                if (r.data) {
                    setApiData({
                        loading: false,
                        error: undefined,
                        message: `Pesan menfess kepada ${r.data.name} telah diposting ke instagram sman3palu.menfess`,
                    });
                    return;
                }
            }).catch(e => {
                setApiData({
                    loading: false,
                    error: (e as Error).message,
                });
            });
        } else {
            fetch('https://kritikapi.sman3palu.sch.id/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({message: pesan().trim(), type: tipe()}),
            }).then(r => r.json()).then(data => {
                setApiData({
                    error: undefined,
                    loading: false,
                    message: data.message,
                });
            }).catch(e => {
                setApiData({
                    loading: false,
                    error: (e as Error).message,
                });
            });
        }

        return;
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            submitHandle();
        }}>
            <div class="form-control w-full" onSubmit={() => {
                return;
            }}>
                <div class="flex w-full">
                    <div class="grid h-20 flex-grow place-items-center">
                        <button type="button" class={`btn btn-primary${kategori() === 'menfess' ? '' : ' btn-outline'}`} onClick={() => setKategori('menfess')}>
                            MENFESS
                        </button>
                    </div>
                    <div class="divider divider-horizontal">ATAU</div>
                    <div class="grid h-20 flex-grow place-items-center">
                        <button type="button" class={`btn btn-secondary${kategori() === 'krs' ? '' : ' btn-outline'}`} onClick={() => setKategori('krs')}>
                            KRITIK & SARAN
                        </button>
                    </div>
                </div>
            </div>

            <Show when={apiData().error}>
                <div class="alert alert-error text-center">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> */}
                    {apiData().error}
                </div>
            </Show>
            <Show when={apiData().message}>
                <div class="alert alert-success
                text-center">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> */}
                    {apiData().message}
                </div>
            </Show>

            {
                kategori() === 'menfess' && (
                    <>
                        <div class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Jalur penyampaian:</span>
                            </div>
                            <select disabled={apiData().loading} required value={target()} onChange={(e) => setTarget(e.target.value)} name="target" class={twMerge("select select-bordered w-full", apiData().loading && 'disabled')}>
                                <option value=''  disabled selected>Pilih jalur penyampaian:</option>
                                <option value="wa">WhatsApp</option>
                                <option value="ig">Instagram</option>
                            </select>

                            <Show when={target() === 'ig'}>
                                <div class="form-control w-full">
                                    <label for="randomName" class="cursor-pointer label">
                                        <span class="label-text">Nama bebas</span>
                                        <input disabled={apiData().loading} type="checkbox" onChange={() => setRandomCondition(!useRandomName())} checked={useRandomName()} class={twMerge("checkbox checkbox-accent", apiData().loading && 'disabled')} />
                                    </label>
                                </div>
                            </Show>
                        </div>

                        {target() && (
                            <>
                                <div class="form-control w-full">
                                    <div class="label">
                                        <span class="label-text">Destinasi:</span>
                                    </div>
                                    <input disabled={apiData().loading} value={destination()} onChange={(e) => setDestination(e.target.value)} required name="destination" type={target() === 'wa' ? 'number' : 'text'} placeholder={`Masukan ${target() === 'wa' ? 'nomor' : 'username'} ${target()?.toUpperCase()} kepada seseorang`} class={twMerge("input input-bordered w-full", apiData().loading && 'disabled')} />
                                </div>
                            </>
                        )}
                    </>
                )
            }
            {kategori() && (
                <>
                    <Show when={kategori() === 'krs'}>
                        <div class="form-control w-full">
                            <div class="label">
                                <span class="label-text">
                                    Saran atau kritik?
                                </span>
                            </div>
                            <select class={twMerge("select select-bordered w-full max-w-xs", apiData().loading && 'disabled')} disabled={apiData().loading} value={tipe()} onChange={(e) => setTipe(e.target.value)}>
                                <option value="" disabled selected>Pilih:</option>
                                <option value="kritik">Saran</option>
                                <option value="saran">Kritik</option>
                            </select>
                        </div>
                        
                    </Show>
                    <div class="form-control w-full">
                        <div class="label">
                            <span class="label-text">
                                Pesan:
                            </span>
                        </div>
                        <textarea disabled={apiData().loading} required minLength={5} maxLength={300} value={pesan()} onChange={(e) => setPesan(e.target.value)} name="message" class={twMerge("textarea textarea-bordered w-full", apiData().loading && 'disabled')} placeholder="Apa pesan yang ingin kamu sampaikan?" />
                    </div>

                    <button type="submit" class={twMerge("btn btn-accent mt-3", apiData().loading && 'disabled')} disabled={apiData().loading ?? false}>
                        <Show when={apiData().loading}>
                            <span class="loading loading-spinner loading-md"></span>
                        </Show>
                        Kirim
                    </button>
                </>
            )}
        </form>
    )
}