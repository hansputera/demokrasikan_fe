import { Show, createSignal } from "solid-js"

export const SentFormJSX = () => {
    const [kategori, setKategori] = createSignal<string>('');
    const [target, setTarget] = createSignal<string>('');
    const [pesan, setPesan] = createSignal<string>('');
    const [destination, setDestination] = createSignal<string>('');
    const [useRandomName, setRandomCondition] = createSignal<boolean>(false);
    const [apiData, setApiData] = createSignal<{
        loading: Boolean;
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
        });
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
                <div class="alert alert-success text-center">
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
                            <select required value={target()} onChange={(e) => setTarget(e.target.value)} name="target" class="select select-bordered w-full">
                                <option value=''  disabled selected>Pilih jalur penyampaian:</option>
                                <option value="wa">WhatsApp</option>
                                <option value="ig">Instagram</option>
                            </select>

                            <Show when={target() === 'ig'}>
                                <div class="form-control w-full">
                                    <label for="randomName" class="cursor-pointer label">
                                        <span class="label-text">Nama bebas</span>
                                        <input type="checkbox" onChange={() => setRandomCondition(!useRandomName())} checked={useRandomName()} class="checkbox checkbox-accent" />
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
                                    <input value={destination()} onChange={(e) => setDestination(e.target.value)} required name="destination" type={target() === 'wa' ? 'number' : 'text'} placeholder={`Masukan ${target() === 'wa' ? 'nomor' : 'username'} ${target()?.toUpperCase()} kepada seseorang`} class="input input-bordered w-full" />
                                </div>
                            </>
                        )}
                    </>
                )
            }
            {kategori() && (
                <>
                    <div class="form-control w-full">
                        <div class="label">
                            <span class="label-text">
                                Pesan:
                            </span>
                        </div>
                        <textarea required minLength={5} maxLength={300} value={pesan()} onChange={(e) => setPesan(e.target.value)} name="message" class="textarea textarea-bordered w-full" placeholder="Apa pesan yang ingin kamu sampaikan?" />
                    </div>

                    <button type="submit" class={`btn btn-accent mt-3 ${apiData().loading ? 'disabled' : ''}`}>
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