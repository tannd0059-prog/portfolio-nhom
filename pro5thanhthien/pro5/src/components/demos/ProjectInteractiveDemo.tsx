import React, { useState, useEffect } from 'react';
import { DemoType } from '@/config/portfolioData';
import {
  Truck,
  Video,
  Calculator,
  Music,
  UserCheck,
  Send,
  AlertTriangle,
  Volume2,
  VolumeX,
  Code2,
} from 'lucide-react';

interface Props {
  demoType: DemoType;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEMO: ETA LOGISTICS SIMULATOR (LightGBM Regression)
// ─────────────────────────────────────────────────────────────────────────────
export const EtaSimulatorDemo: React.FC = () => {
  const [route, setRoute] = useState<'catlai-songthan' | 'caimep-thuduc' | 'tanbinh-tsn'>('catlai-songthan');
  const [cargoWeight, setCargoWeight] = useState(12); // Tấn
  const [weather, setWeather] = useState<'clear' | 'rain' | 'flood'>('clear');
  const [isPeakHour, setIsPeakHour] = useState(true);
  const [vehicle, setVehicle] = useState<'container' | 'truck8t' | 'van'>('container');
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<{
    etaMinutes: number;
    confidence: number;
    riskScore: number;
    delayRisk: string;
  } | null>(null);

  const routeDetails = {
    'catlai-songthan': { name: 'Cảng Cát Lái ➔ KCN Sóng Thần', distanceKm: 32, baseMinutes: 55 },
    'caimep-thuduc': { name: 'Cụm Cảng Cái Mép ➔ ICD Thủ Đức', distanceKm: 65, baseMinutes: 110 },
    'tanbinh-tsn': { name: 'Kho Logistics Tân Bình ➔ Sân bay TSN', distanceKm: 8, baseMinutes: 22 },
  };

  const handlePredict = () => {
    setIsPredicting(true);
    setTimeout(() => {
      const selected = routeDetails[route];
      let weatherFactor = 1.0;
      if (weather === 'rain') weatherFactor = 1.25;
      if (weather === 'flood') weatherFactor = 1.6;

      const peakFactor = isPeakHour ? 1.4 : 1.0;
      const weightFactor = 1 + (cargoWeight / 30) * 0.15;
      const vehicleFactor = vehicle === 'container' ? 1.15 : vehicle === 'truck8t' ? 1.0 : 0.85;

      const totalMinutes = Math.round(selected.baseMinutes * weatherFactor * peakFactor * weightFactor * vehicleFactor);
      const confidence = Math.round((0.92 - (weather === 'flood' ? 0.08 : 0) - (isPeakHour ? 0.04 : 0)) * 100);
      const riskScore = Math.min(95, Math.round((weatherFactor * peakFactor * 25) + cargoWeight));

      let delayRisk = 'Thấp (Thông thoáng)';
      if (riskScore > 45) delayRisk = 'Trung bình (Chậm 10-15m)';
      if (riskScore > 70) delayRisk = 'Rất cao (Nguy cơ nghẽn đường)';

      setPrediction({
        etaMinutes: totalMinutes,
        confidence,
        riskScore,
        delayRisk,
      });
      setIsPredicting(false);
    }, 600);
  };

  useEffect(() => {
    handlePredict();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, cargoWeight, weather, isPeakHour, vehicle]);

  return (
    <div className="space-y-5 rounded-2xl border border-emerald-500/30 bg-[#0d1414]/90 p-5 font-sans">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Mô Phỏng Dự Đoán ETA • Model: LightGBM
          </h4>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
          `lgbm_eta_model.pkl` Live
        </span>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Tuyến Vận Tải</label>
          <select
            value={route}
            onChange={(e) => setRoute(e.target.value as any)}
            className="w-full rounded-xl bg-slate-900 border border-emerald-500/30 p-2.5 text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="catlai-songthan">Cảng Cát Lái ➔ KCN Sóng Thần (32 km)</option>
            <option value="caimep-thuduc">Cảng Cái Mép ➔ ICD Thủ Đức (65 km)</option>
            <option value="tanbinh-tsn">Kho Tân Bình ➔ Sân bay Tân Sơn Nhất (8 km)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Phương Tiện</label>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value as any)}
            className="w-full rounded-xl bg-slate-900 border border-emerald-500/30 p-2.5 text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="container">Xe Container 40ft (Đầu kéo nặng)</option>
            <option value="truck8t">Xe tải thùng 8 tấn</option>
            <option value="van">Xe Van giao nhanh Express</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Tải Trọng Hàng Hóa: <span className="text-emerald-400 font-mono font-bold">{cargoWeight} Tấn</span>
          </label>
          <input
            type="range"
            min={1}
            max={32}
            value={cargoWeight}
            onChange={(e) => setCargoWeight(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Điều Kiện Thời Tiết & Giao Thông</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setWeather('clear')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                weather === 'clear' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-white/5'
              }`}
            >
              ☀️ Nắng ráo
            </button>
            <button
              type="button"
              onClick={() => setWeather('rain')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                weather === 'rain' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-white/5'
              }`}
            >
              🌧️ Mưa rào
            </button>
            <button
              type="button"
              onClick={() => setWeather('flood')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                weather === 'flood' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-white/5'
              }`}
            >
              🌊 Ngập triều
            </button>
          </div>
        </div>
      </div>

      {/* Peak hour toggle */}
      <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-3 border border-emerald-500/20">
        <span className="text-xs text-slate-300 font-medium">Khung giờ cao điểm (07:00 - 09:00 hoặc 17:00 - 19:00)</span>
        <button
          type="button"
          onClick={() => setIsPeakHour(!isPeakHour)}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
            isPeakHour ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isPeakHour ? 'BẬT (Cao điểm)' : 'TẮT (Bình thường)'}
        </button>
      </div>

      {/* Model Output Result */}
      {prediction && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-mono">DỰ BÁO THỜI GIAN (ETA)</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1 block">
                {isPredicting ? '...' : `${Math.floor(prediction.etaMinutes / 60)}h ${prediction.etaMinutes % 60}m`}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">({prediction.etaMinutes} phút)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-mono">ĐỘ TIN CẬY (CONFIDENCE)</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-cyan-400 mt-1 block">
                {isPredicting ? '...' : `${prediction.confidence}%`}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">R²: 0.924</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 block font-mono">MỨC ĐỘ RỦI RO CHẬM TRỄ</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400 mt-2 block">
                {isPredicting ? '...' : prediction.delayRisk}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Chỉ số: {prediction.riskScore}/100</span>
            </div>
          </div>

          {/* Feature Importance Bars */}
          <div className="mt-4 pt-3 border-t border-emerald-500/20">
            <span className="text-[11px] font-mono text-slate-400 block mb-2">
              Feature Importance (Độ ảnh hưởng đặc trưng):
            </span>
            <div className="space-y-1.5 text-[10px] font-mono">
              <div>
                <div className="flex justify-between text-slate-300">
                  <span>Khoảng cách & Cung đường (Geo-Distance)</span>
                  <span className="text-emerald-400">42%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-300">
                  <span>Giờ cao điểm & Mật độ giao thông</span>
                  <span className="text-emerald-400">28%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-300">
                  <span>Thời tiết & Triều cường ngập</span>
                  <span className="text-emerald-400">18%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. DEMO: SMART AI SURVEILLANCE CCTV & TELEGRAM ALERT
// ─────────────────────────────────────────────────────────────────────────────
export const SurveillanceCctvDemo: React.FC = () => {
  const [isNightMode, setIsNightMode] = useState(false);
  const [showRoi, setShowRoi] = useState(true);
  const [alertSent, setAlertSent] = useState(false);
  const [logEvents, setLogEvents] = useState<string[]>([
    '21:20:12 - [INIT] YOLOv5 detector initialized (CUDA/CPU fallback)',
    '21:20:14 - [STREAM] RTSP Camera Gate 01 connected (1080p@30fps)',
    '21:20:18 - [DETECT] Person #1 conf: 0.95 in Safe Zone',
  ]);

  const triggerTelegramAlert = () => {
    setAlertSent(true);
    const newLog = `${new Date().toLocaleTimeString()} - [ALARM] Intruder detected in RESTRICTED ROI -> Telegram message dispatched!`;
    setLogEvents((prev) => [newLog, ...prev.slice(0, 4)]);
    setTimeout(() => setAlertSent(false), 4000);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-cyan-500/30 bg-[#0b1016]/90 p-5 font-sans">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-cyan-400 animate-pulse" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            CCTV AI Live Stream Simulator • FastAPI + YOLO
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-[11px] font-mono text-red-400 uppercase font-bold">REC 1080P</span>
        </div>
      </div>

      {/* Simulated Surveillance Screen */}
      <div
        className={`relative h-60 w-full rounded-xl overflow-hidden border border-white/10 transition-colors duration-500 ${
          isNightMode ? 'bg-[#001408]' : 'bg-[#0b131f]'
        }`}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#00f2fe_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        {/* Camera OSD info */}
        <div className="absolute top-2 left-3 font-mono text-[11px] text-cyan-300 drop-shadow flex items-center gap-3">
          <span>CAM-01: KHO_LOGISTICS_UTH</span>
          <span>FPS: 28.4</span>
        </div>
        <div className="absolute top-2 right-3 font-mono text-[11px] text-cyan-300 drop-shadow">
          {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString()}
        </div>

        {/* Restricted ROI Boundary */}
        {showRoi && (
          <div className="absolute inset-x-8 top-12 bottom-10 border-2 border-dashed border-red-500/60 rounded-lg pointer-events-none flex items-start justify-end p-1">
            <span className="bg-red-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">
              ROI: VÙNG AN NINH NGHIÊM NGẶT
            </span>
          </div>
        )}

        {/* Simulated Object Bounding Box 1: Person */}
        <div className="absolute left-14 top-16 w-24 h-36 border-2 border-emerald-400 bg-emerald-500/10 rounded flex flex-col justify-between p-1 transition-all">
          <span className="bg-emerald-500 text-slate-950 font-mono text-[9px] font-bold px-1 rounded self-start">
            Person: 0.96
          </span>
          <span className="text-[9px] text-emerald-300 font-mono">ID: #042</span>
        </div>

        {/* Simulated Object Bounding Box 2: Forklift/Intruder */}
        <div className="absolute right-16 top-20 w-32 h-28 border-2 border-red-500 bg-red-500/15 rounded flex flex-col justify-between p-1 animate-pulse">
          <span className="bg-red-500 text-white font-mono text-[9px] font-bold px-1 rounded self-start flex items-center gap-1">
            <AlertTriangle className="h-2.5 w-2.5" /> INTRUSION: 0.92
          </span>
          <span className="text-[9px] text-red-300 font-mono font-bold bg-slate-950/70 px-1 rounded">
            Target in Restricted Zone!
          </span>
        </div>

        {/* Night vision overlay */}
        {isNightMode && (
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none mix-blend-color" />
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsNightMode(!isNightMode)}
            className={`px-3 py-2 rounded-xl font-semibold transition-all ${
              isNightMode ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-white/10'
            }`}
          >
            {isNightMode ? '🌙 Hồng Ngoại (BẬT)' : '☀️ Hồng Ngoại (TẮT)'}
          </button>

          <button
            type="button"
            onClick={() => setShowRoi(!showRoi)}
            className={`px-3 py-2 rounded-xl font-semibold transition-all ${
              showRoi ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-white/10'
            }`}
          >
            {showRoi ? '🎯 Hiện Vùng ROI' : 'Ẩn Vùng ROI'}
          </button>
        </div>

        <button
          type="button"
          onClick={triggerTelegramAlert}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Bắn Snapshot Cảnh Báo Telegram</span>
        </button>
      </div>

      {/* Telegram Alert Simulated Popup */}
      {alertSent && (
        <div className="rounded-xl border border-cyan-400/50 bg-[#17212b] p-3 text-white text-xs shadow-2xl animate-in fade-in slide-in-from-top-2 flex items-start gap-3">
          <div className="rounded-full bg-cyan-500 p-2 text-slate-950">
            <Send className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400">Telegram Bot: @UTH_Security_Alert_Bot</span>
              <span className="text-[10px] text-slate-400">Vừa xong</span>
            </div>
            <p className="mt-1 text-slate-200">
              🚨 <strong>CẢNH BÁO XÂM NHẬP:</strong> Phát hiện đối tượng trong Vùng An Ninh Kho lúc{' '}
              {new Date().toLocaleTimeString()}! Ảnh snapshot đã được lưu tại <code>snapshots/alert_01.jpg</code>.
            </p>
          </div>
        </div>
      )}

      {/* Real-time System Log */}
      <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-slate-400 border border-white/5 space-y-1">
        <span className="text-cyan-400 font-bold block mb-1">EVENT LOGS (SQLite History):</span>
        {logEvents.map((log, i) => (
          <div key={i} className="truncate">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. DEMO: SMART LOGISTICS DIM & FREIGHT ENGINE
// ─────────────────────────────────────────────────────────────────────────────
export const DimFreightDemo: React.FC = () => {
  const [lengthCm, setLengthCm] = useState(80);
  const [widthCm, setWidthCm] = useState(60);
  const [heightCm, setHeightCm] = useState(50);
  const [grossWeightKg, setGrossWeightKg] = useState(25);
  const [mode, setMode] = useState<'air' | 'sea' | 'road'>('air');

  const divisor = mode === 'air' ? 5000 : mode === 'sea' ? 6000 : 3000;
  const cbm = (lengthCm * widthCm * heightCm) / 1000000;
  const volumetricWeightKg = (lengthCm * widthCm * heightCm) / divisor;
  const chargeableWeightKg = Math.max(grossWeightKg, volumetricWeightKg);

  const ratePerKg = mode === 'air' ? 120000 : mode === 'sea' ? 35000 : 45000;
  const estimatedCostVnd = Math.round(chargeableWeightKg * ratePerKg);

  return (
    <div className="space-y-4 rounded-2xl border border-blue-500/30 bg-[#0c121d]/90 p-5 font-sans">
      <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Freight & DIM Weight Engine • API B2B
          </h4>
        </div>
        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-mono text-blue-400 border border-blue-500/30">
          IATA Standard 1:{divisor}
        </span>
      </div>

      {/* Mode selection */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode('air')}
          className={`py-2 px-3 rounded-xl font-bold transition-all ${
            mode === 'air' ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-white/5'
          }`}
        >
          ✈️ Hàng Không (Air / 5000)
        </button>
        <button
          type="button"
          onClick={() => setMode('road')}
          className={`py-2 px-3 rounded-xl font-bold transition-all ${
            mode === 'road' ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-white/5'
          }`}
        >
          🚚 Đường Bộ (Road / 3000)
        </button>
        <button
          type="button"
          onClick={() => setMode('sea')}
          className={`py-2 px-3 rounded-xl font-bold transition-all ${
            mode === 'sea' ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-white/5'
          }`}
        >
          🚢 Đường Biển (Sea / CBM)
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Dài (cm)</label>
          <input
            type="number"
            value={lengthCm}
            onChange={(e) => setLengthCm(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl bg-slate-900 border border-blue-500/30 p-2 text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Rộng (cm)</label>
          <input
            type="number"
            value={widthCm}
            onChange={(e) => setWidthCm(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl bg-slate-900 border border-blue-500/30 p-2 text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Cao (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl bg-slate-900 border border-blue-500/30 p-2 text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Trọng Lượng Thực (kg)</label>
          <input
            type="number"
            value={grossWeightKg}
            onChange={(e) => setGrossWeightKg(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl bg-slate-900 border border-blue-500/30 p-2 text-emerald-400 font-mono font-bold"
          />
        </div>
      </div>

      {/* Calculation Output Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-xl bg-slate-900/90 p-3 border border-white/5">
          <span className="text-[10px] text-slate-400 block font-mono">THỂ TÍCH (CBM)</span>
          <span className="text-base sm:text-lg font-bold font-mono text-cyan-400 mt-1 block">
            {cbm.toFixed(3)} m³
          </span>
        </div>

        <div className="rounded-xl bg-slate-900/90 p-3 border border-white/5">
          <span className="text-[10px] text-slate-400 block font-mono">DIM WEIGHT (QUY ĐỔI)</span>
          <span className="text-base sm:text-lg font-bold font-mono text-blue-400 mt-1 block">
            {volumetricWeightKg.toFixed(1)} kg
          </span>
        </div>

        <div className="rounded-xl bg-blue-950/40 p-3 border border-blue-500/40">
          <span className="text-[10px] text-blue-300 block font-mono font-bold">CHARGEABLE WEIGHT</span>
          <span className="text-base sm:text-lg font-black font-mono text-white mt-1 block">
            {chargeableWeightKg.toFixed(1)} kg
          </span>
          <span className="text-[9px] text-slate-400">
            {volumetricWeightKg > grossWeightKg ? '(Tính theo Thể tích)' : '(Tính theo Cân nặng)'}
          </span>
        </div>

        <div className="rounded-xl bg-emerald-950/40 p-3 border border-emerald-500/40">
          <span className="text-[10px] text-emerald-300 block font-mono font-bold">CƯỚC ƯỚC TÍNH (VND)</span>
          <span className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-1 block">
            {estimatedCostVnd.toLocaleString('vi-VN')} đ
          </span>
          <span className="text-[9px] text-slate-400">Đơn giá: {ratePerKg.toLocaleString('vi-VN')} đ/kg</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. DEMO: MUSIC RECOMMENDER (K-Means Clustering Radar)
// ─────────────────────────────────────────────────────────────────────────────
export const MusicRadarDemo: React.FC = () => {
  const [energy, setEnergy] = useState(85);
  const [danceability, setDanceability] = useState(90);
  const [valence, setValence] = useState(70);
  const [isPlaying, setIsPlaying] = useState(false);

  const presets = [
    { name: 'Vinahouse / High Energy', e: 95, d: 92, v: 80 },
    { name: 'Viet Deep / Chill Night', e: 55, d: 65, v: 50 },
    { name: 'Cyberpunk Synthwave', e: 80, d: 75, v: 40 },
    { name: 'Lofi Study & Focus', e: 30, d: 45, v: 60 },
  ];

  const getRecommendations = () => {
    if (energy > 75 && danceability > 75) {
      return [
        { title: 'Vinahouse Bass Boosted Mix 2026', artist: 'Viet DJ Team', match: '98.4%', cluster: 'Cluster #0 (High BPM Dance)' },
        { title: 'Nonstop Bay Phong Cách Đua Xe', artist: 'DJ Thái Tuấn', match: '96.1%', cluster: 'Cluster #0 (High BPM Dance)' },
        { title: 'Energy Cyber Drive Track', artist: 'Synthwave VN', match: '92.7%', cluster: 'Cluster #0 (High BPM Dance)' },
      ];
    } else if (energy < 50) {
      return [
        { title: 'Rainy Night in Saigon (Lofi Chill)', artist: 'Lofi Vietnam', match: '97.2%', cluster: 'Cluster #3 (Acoustic Low-Tempo)' },
        { title: 'Gác Lại Âu Lo (Melodic Acoustic)', artist: 'Da LAB', match: '94.0%', cluster: 'Cluster #3 (Acoustic Low-Tempo)' },
        { title: 'Midnight Coffee Beats', artist: 'Hanoi Chillhop', match: '91.5%', cluster: 'Cluster #3 (Acoustic Low-Tempo)' },
      ];
    } else {
      return [
        { title: 'Viet Deep House Sunset Melodies', artist: 'DeepSound VN', match: '96.5%', cluster: 'Cluster #1 (Melodic House)' },
        { title: 'Đi Về Nhà (Deep House Remix)', artist: 'K-ICM x Masew', match: '94.2%', cluster: 'Cluster #1 (Melodic House)' },
        { title: 'Chạy Ngay Đi (Deep Club Mix)', artist: 'Onionn', match: '93.0%', cluster: 'Cluster #1 (Melodic House)' },
      ];
    }
  };

  const tracks = getRecommendations();

  return (
    <div className="space-y-4 rounded-2xl border border-purple-500/30 bg-[#120e1c]/90 p-5 font-sans">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-purple-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            AI Music Recommendation • K-Means Engine
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
            isPlaying ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          {isPlaying ? <Volume2 className="h-3.5 w-3.5 animate-bounce" /> : <VolumeX className="h-3.5 w-3.5" />}
          <span>{isPlaying ? 'Visualizer Đang Phát' : 'Bật Audio Wave'}</span>
        </button>
      </div>

      {/* Preset tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => {
              setEnergy(p.e);
              setDanceability(p.d);
              setValence(p.v);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-purple-500/20 text-slate-300 hover:text-white hover:border-purple-400 text-[11px]"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Acoustic Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1 font-semibold">
            <span>Energy (Năng lượng)</span>
            <span className="text-purple-400 font-mono font-bold">{energy}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-purple-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 font-semibold">
            <span>Danceability (Độ bốc)</span>
            <span className="text-pink-400 font-mono font-bold">{danceability}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={danceability}
            onChange={(e) => setDanceability(Number(e.target.value))}
            className="w-full accent-pink-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1 font-semibold">
            <span>Valence (Tâm trạng)</span>
            <span className="text-cyan-400 font-mono font-bold">{valence}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={valence}
            onChange={(e) => setValence(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
      </div>

      {/* Simulated Audio Visualizer Wave */}
      {isPlaying && (
        <div className="flex items-end justify-center gap-1.5 h-12 bg-slate-950/70 rounded-xl p-2 border border-purple-500/20">
          {[40, 75, 95, 60, 85, 100, 45, 90, 70, 80, 50, 95, 65, 85, 100, 70, 50, 85].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-purple-600 to-pink-400 rounded-full animate-pulse"
              style={{
                height: `${Math.max(15, (h * (energy / 100)))}%`,
                animationDelay: `${i * 70}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Recommended Songs by K-Means */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-mono text-purple-300 block font-bold">
          K-MEANS CLUSTER RECOMMENDATION RESULTS:
        </span>
        <div className="space-y-2">
          {tracks.map((track, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl bg-slate-900/90 p-3 border border-purple-500/20 text-xs"
            >
              <div>
                <span className="font-bold text-white block">{track.title}</span>
                <span className="text-slate-400 text-[11px]">
                  {track.artist} • <span className="text-purple-400 font-mono">{track.cluster}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-pink-400">{track.match} Match</span>
                <span className="block text-[9px] text-slate-400">Euclidean Sim</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. DEMO: SOCIAL PROFILE & DEV INTELLIGENCE EXTRACTOR
// ─────────────────────────────────────────────────────────────────────────────
export const SocialProfileExtractorDemo: React.FC = () => {
  const [username, setUsername] = useState('dinhthanhthien10-bit');
  const [isLoading, setIsLoading] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [devData, setDevData] = useState<any>({
    username: 'dinhthanhthien10-bit',
    name: 'Đinh Thanh Thiên',
    university: 'UTH TP.HCM',
    publicRepos: 9,
    topLanguages: [
      { name: 'Python', percent: 52 },
      { name: 'Jupyter Notebook', percent: 28 },
      { name: 'HTML / Web', percent: 20 },
    ],
    status: 'Active Builder',
    focusArea: 'AI Engineering & Smart Logistics',
  });

  const handleExtract = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDevData({
        username: username.trim(),
        name: username.includes('dinhthanhthien') ? 'Đinh Thanh Thiên' : `${username}`,
        university: 'UTH TP.HCM',
        publicRepos: username.includes('dinhthanhthien') ? 9 : 14,
        topLanguages: [
          { name: 'Python', percent: 55 },
          { name: 'TypeScript', percent: 25 },
          { name: 'HTML / CSS', percent: 20 },
        ],
        status: 'Verified Developer',
        focusArea: 'AI & Data Science',
      });
    }, 500);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-amber-500/30 bg-[#16120b]/90 p-5 font-sans">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-amber-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Social Profile Extractor • Live Dev Card
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setShowJson(!showJson)}
          className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-white"
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>{showJson ? 'Ẩn JSON' : 'Xem JSON Thô'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 text-xs">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập username GitHub..."
          className="flex-1 rounded-xl bg-slate-900 border border-amber-500/30 px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
        />
        <button
          type="button"
          onClick={handleExtract}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-50"
        >
          {isLoading ? 'Đang trích xuất...' : 'Trích Xuất'}
        </button>
      </div>

      {/* Rendered Dev Card */}
      {!showJson ? (
        <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-4 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-base font-bold text-white">{devData.name}</h5>
              <span className="font-mono text-amber-400 text-[11px]">@{devData.username}</span>
            </div>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
              {devData.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-slate-900 border border-white/5">
              <span className="text-slate-400 block">Số Repositories:</span>
              <span className="text-amber-400 font-bold text-sm">{devData.publicRepos} Repos công khai</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-white/5">
              <span className="text-slate-400 block">Trường đại học:</span>
              <span className="text-white font-bold">{devData.university}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-300 block mb-1">
              Phân tích tỷ lệ ngôn ngữ (Language Breakdown):
            </span>
            <div className="space-y-1.5 font-mono text-[10px]">
              {devData.topLanguages.map((l: any) => (
                <div key={l.name}>
                  <div className="flex justify-between text-slate-300">
                    <span>{l.name}</span>
                    <span className="text-amber-400 font-bold">{l.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${l.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <pre className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-emerald-400 border border-white/10 overflow-x-auto max-h-48">
          {JSON.stringify(devData, null, 2)}
        </pre>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DISPATCHER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const ProjectInteractiveDemo: React.FC<Props> = ({ demoType }) => {
  if (!demoType) return null;

  switch (demoType) {
    case 'eta-simulator':
      return <EtaSimulatorDemo />;
    case 'surveillance-cctv':
      return <SurveillanceCctvDemo />;
    case 'dim-freight':
      return <DimFreightDemo />;
    case 'music-radar':
      return <MusicRadarDemo />;
    case 'dev-card':
      return <SocialProfileExtractorDemo />;
    default:
      return null;
  }
};

export default ProjectInteractiveDemo;
