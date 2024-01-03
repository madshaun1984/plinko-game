import pixImg from '@images/pix.png'

export function Contribute() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="mx-auto flex w-1/2 flex-col items-center justify-center">
        <h2 className="mb-4 flex items-center gap-2 text-center text-xl font-bold text-text">
          Scan or click on the QR code
        </h2>
        <figure>
          <a target="_blank" href="https://madshaun19.cb.id" rel="noreferrer">
            <img src={pixImg} alt="https://madshaun19.cb.id" />
          </a>
          <figcaption className="text-center text-text"></figcaption>
        </figure>
        <div className="mt-4">
          <span className="block text-center text-sm font-bold text-text">
            or open my coinbase profile to send me a message.
          </span>
          <span className="block text-center text-xl font-bold text-purple">
            <a href="https://madshaun19.cb.id">madshaun19.cb.id</a>
          </span>
        </div>
      </div>
    </div>
  )
}
