import { useState, useRef } from "react";

interface StoneWork {
  name: string;
  bold?: boolean;
  italic?: boolean;
  size: string;
  sum: string;
}

interface ArtWork {
  name: string;
  italic?: boolean;
  qty: string;
  sum: string;
}

const initialStone: StoneWork[] = [
  { name: "Памятник (название)", bold: true, size: "", sum: "" },
  { name: "", size: "", sum: "" },
  { name: "полировка", italic: true, size: "", sum: "" },
  { name: "Подставка", bold: true, size: "", sum: "" },
  { name: "полировка", italic: true, size: "", sum: "" },
  { name: "Цветник", bold: true, size: "", sum: "" },
  { name: "полировка", italic: true, size: "", sum: "" },
  { name: "", size: "", sum: "" },
  { name: "", size: "", sum: "" },
];

const initialArt: ArtWork[] = [
  { name: "Шрифт", qty: "", sum: "" },
  { name: "Крест", qty: "", sum: "" },
  { name: "Ретушь", qty: "", sum: "" },
  { name: "Портрет (гравировка)", italic: true, qty: "", sum: "" },
  { name: "Металлофото\\эмаль", qty: "", sum: "" },
  { name: "Покраска", qty: "", sum: "" },
  { name: "Технолог. отверстия", qty: "", sum: "" },
  { name: "Эпитафия", qty: "", sum: "" },
  { name: "Рисунок (гравировка)", italic: true, qty: "", sum: "" },
  { name: "", qty: "", sum: "" },
  { name: "Рисунок (пескоструйн.)", italic: true, qty: "", sum: "" },
  { name: "", qty: "", sum: "" },
  { name: "МАКЕТ", italic: true, qty: "", sum: "" },
  { name: "", qty: "", sum: "" },
];

export default function OrderForm() {
  const [orderNum, setOrderNum] = useState("");
  const [master, setMaster] = useState("");
  const [section, setSection] = useState("");
  const [dateAccepted, setDateAccepted] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stone, setStone] = useState<StoneWork[]>(initialStone);
  const [art, setArt] = useState<ArtWork[]>(initialArt);
  const [deadline, setDeadline] = useState("");
  const [advance, setAdvance] = useState("");
  const [advanceText, setAdvanceText] = useState("");
  const [sketchImage, setSketchImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stoneTotal = stone.reduce((acc, r) => acc + (parseFloat(r.sum) || 0), 0);
  const artTotal = art.reduce((acc, r) => acc + (parseFloat(r.sum) || 0), 0);
  const grandTotal = stoneTotal + artTotal;

  const updateStone = (i: number, field: keyof StoneWork, val: string) => {
    setStone((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  const updateArt = (i: number, field: keyof ArtWork, val: string) => {
    setArt((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSketchImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePrint = () => window.print();

  const inp = "border-0 border-b border-black bg-transparent outline-none w-full text-sm print:text-xs";
  const cell = "border border-black text-sm print:text-xs";
  const cellInp = "w-full h-full bg-transparent outline-none text-center text-sm print:text-xs px-1";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 print:bg-white print:py-0">
      {/* Print button — hidden on print */}
      <div className="mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800"
        >
          Распечатать
        </button>
      </div>

      {/* A4 page */}
      <div
        className="bg-white w-[210mm] min-h-[297mm] p-8 print:p-6 print:shadow-none shadow-xl"
        style={{ fontFamily: "Times New Roman, serif" }}
      >
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold">
            Заказ №{" "}
            <input
              value={orderNum}
              onChange={(e) => setOrderNum(e.target.value)}
              className="border-b border-black bg-transparent outline-none w-24 text-center text-2xl font-bold"
              placeholder="___"
            />
          </h1>
        </div>

        <div className="flex justify-between text-sm mb-1">
          <div>
            <div>
              Мастер по установке{" "}
              <input value={master} onChange={(e) => setMaster(e.target.value)} className={inp} style={{ width: 150 }} />
            </div>
            <div>
              (участок){" "}
              <input value={section} onChange={(e) => setSection(e.target.value)} className={inp} style={{ width: 150 }} />
            </div>
          </div>
          <div className="text-right text-sm">
            (дата принятия){" "}
            <input value={dateAccepted} onChange={(e) => setDateAccepted(e.target.value)} className={inp} style={{ width: 120 }} />
          </div>
        </div>

        <div className="border-t border-black mt-2 mb-1" />

        {/* Customer info */}
        <table className="w-full text-sm mb-1">
          <tbody>
            <tr>
              <td className="font-bold pr-2 whitespace-nowrap py-0.5">Заказчик</td>
              <td className="w-full"><input value={customer} onChange={(e) => setCustomer(e.target.value)} className={inp} /></td>
            </tr>
            <tr>
              <td className="font-bold pr-2 whitespace-nowrap py-0.5">Телефон</td>
              <td><input value={phone} onChange={(e) => setPhone(e.target.value)} className={inp} /></td>
            </tr>
            <tr>
              <td className="font-bold pr-2 whitespace-nowrap py-0.5">Адрес</td>
              <td><input value={address} onChange={(e) => setAddress(e.target.value)} className={inp} /></td>
            </tr>
          </tbody>
        </table>

        <div className="border-t border-black mb-2" />

        {/* Main content: left tables + right sketch */}
        <div className="flex gap-2">
          {/* Left: Stone + Art tables */}
          <div className="flex-1">
            {/* Stone works table */}
            <table className="w-full border-collapse mb-2">
              <thead>
                <tr>
                  <th className={`${cell} text-left px-1 py-0.5`} style={{ width: "55%" }}>Работы по камню</th>
                  <th className={`${cell} text-center px-1 py-0.5`} style={{ width: "22%" }}>Размер</th>
                  <th className={`${cell} text-center px-1 py-0.5`} style={{ width: "23%" }}>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {stone.map((row, i) => (
                  <tr key={i} style={{ height: 22 }}>
                    <td className={cell}>
                      {row.name !== undefined && row.name !== "" ? (
                        <span className={`px-1 ${row.bold ? "font-bold" : ""} ${row.italic ? "italic" : ""}`}>
                          {row.name}
                        </span>
                      ) : (
                        <input
                          value={row.name}
                          onChange={(e) => updateStone(i, "name", e.target.value)}
                          className={cellInp}
                          style={{ textAlign: "left", paddingLeft: 4 }}
                        />
                      )}
                    </td>
                    <td className={cell}>
                      <input value={row.size} onChange={(e) => updateStone(i, "size", e.target.value)} className={cellInp} />
                    </td>
                    <td className={cell}>
                      <input value={row.sum} onChange={(e) => updateStone(i, "sum", e.target.value)} className={cellInp} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-sm mb-2">
              Итого:{" "}
              <span className="font-medium">{stoneTotal > 0 ? stoneTotal.toLocaleString("ru-RU") : ""}</span>
            </div>

            {/* Art works table */}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={`${cell} text-left px-1 py-0.5`} style={{ width: "55%" }}>Художественные работы</th>
                  <th className={`${cell} text-center px-1 py-0.5`} style={{ width: "22%" }}>Кол-во</th>
                  <th className={`${cell} text-center px-1 py-0.5`} style={{ width: "23%" }}>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {art.map((row, i) => (
                  <tr key={i} style={{ height: 22 }}>
                    <td className={cell}>
                      {row.name !== "" ? (
                        <span className={`px-1 ${row.italic ? "italic" : ""}`}>{row.name}</span>
                      ) : (
                        <input
                          value={row.name}
                          onChange={(e) => updateArt(i, "name", e.target.value)}
                          className={cellInp}
                          style={{ textAlign: "left", paddingLeft: 4 }}
                        />
                      )}
                    </td>
                    <td className={cell}>
                      <input value={row.qty} onChange={(e) => updateArt(i, "qty", e.target.value)} className={cellInp} />
                    </td>
                    <td className={cell}>
                      <input value={row.sum} onChange={(e) => updateArt(i, "sum", e.target.value)} className={cellInp} />
                    </td>
                  </tr>
                ))}
                <tr style={{ height: 22 }}>
                  <td className={`${cell} font-bold px-1`}>Итого:</td>
                  <td className={cell} />
                  <td className={`${cell} text-center font-medium`}>
                    {artTotal > 0 ? artTotal.toLocaleString("ru-RU") : ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right: Sketch area */}
          <div
            className="border border-black flex flex-col items-center justify-start"
            style={{ width: 200, minHeight: 420 }}
          >
            <div className="text-xs text-center py-1 border-b border-black w-full">место для эскиза</div>
            <div
              className="flex-1 flex flex-col items-center justify-center w-full cursor-pointer print:cursor-default"
              onClick={() => !sketchImage && fileRef.current?.click()}
            >
              {sketchImage ? (
                <div className="relative w-full h-full flex items-center justify-center p-1">
                  <img src={sketchImage} alt="эскиз" className="max-w-full max-h-full object-contain" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setSketchImage(null); }}
                    className="absolute top-1 right-1 bg-white border border-gray-400 rounded text-xs px-1 print:hidden"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="text-gray-400 text-xs text-center px-2 print:hidden">
                  Нажмите чтобы загрузить изображение
                </span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>
        </div>

        {/* Grand total */}
        <div className="mt-4 mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold underline">ИТОГО:</span>
            <span className="text-lg font-bold ml-2">
              {grandTotal > 0 ? grandTotal.toLocaleString("ru-RU") + " ₽" : ""}
            </span>
          </div>
          <div className="text-xs text-center" style={{ marginLeft: 80 }}>(общая стоимость заказа)</div>
        </div>

        <div className="border-t border-black mb-3" />

        {/* Footer fields */}
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">Срок изготовления</span>
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} className={`${inp} flex-1`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">Аванс внесен</span>
              <input value={advance} onChange={(e) => setAdvance(e.target.value)} className={`${inp} flex-1`} />
            </div>
            <div className="text-xs text-center ml-32">(сумма прописью)</div>
            <input value={advanceText} onChange={(e) => setAdvanceText(e.target.value)} className={`${inp} w-full mt-1`} />
          </div>
        </div>

        <div className="border-t border-black my-3" />

        <div className="text-sm mb-2">
          <div>С эскизом согласен(на), материал осмотрен, претензий не имею</div>
          <div className="flex justify-end mt-1">
            <div className="text-center">
              <div className="border-b border-black w-48" />
              <div className="text-xs">(подпись заказчика)</div>
            </div>
          </div>
        </div>

        <div className="flex gap-8 text-sm mb-2">
          <div>
            <div>Аванс принял(а)</div>
            <div className="border-b border-black w-36" />
            <div className="text-xs">(подпись)</div>
          </div>
          <div>
            <div>Заказ принял(а)</div>
            <div className="border-b border-black w-36" />
            <div className="text-xs">(подпись)</div>
          </div>
        </div>

        <div className="text-sm mb-4">
          <div>Окончательный расчет произвел(а)</div>
          <div className="flex gap-8 mt-1">
            <div>
              <div className="border-b border-black w-28" />
              <div className="text-xs">(дата)</div>
            </div>
            <div>
              <div className="border-b border-black w-44" />
              <div className="text-xs">(подпись менеджера)</div>
            </div>
          </div>
        </div>

        {/* Company footer */}
        <div className="text-center mt-4 border-t border-gray-300 pt-3">
          <div className="text-2xl font-bold">+7 (996) 068-11-68</div>
          <div className="text-sm">09:00 - 21:00 (без обеда и выходных)</div>
          <div className="text-sm font-bold underline">vekpam@mail.ru</div>
        </div>
      </div>

      <style>{`
        @media print {
          body { margin: 0; }
          @page { size: A4; margin: 10mm; }
          .print\\:hidden { display: none !important; }
          input { border: none !important; }
          input:focus { outline: none; }
        }
      `}</style>
    </div>
  );
}
