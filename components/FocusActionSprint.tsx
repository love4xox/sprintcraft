'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Dices, Plus, Trash2, CheckCircle2, Flame, Sparkles } from 'lucide-react';

interface CustomAction {
  id: string;
  text: string;
}

const DEFAULT_ACTIONS = [
  '코드 한 줄 또는 첫 주석 먼저 달기',
  '책상 위 불필요한 물건 3개 치우기',
  '오늘 끝낼 핵심 목표 1가지 메모지에 적기',
  '물 한 잔 마시고 깊게 호흡 3번 하기',
  '문서/리드미 첫 문단 1줄 작성하기',
  '함수 1개의 입출력 테스트 케이스만 만들기',
];

export default function FocusActionSprint() {
  const [targetMinutes, setTargetMinutes] = useState<number>(15);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const [actions, setActions] = useState<CustomAction[]>([]);
  const [newActionInput, setNewActionInput] = useState<string>('');
  const [pickedAction, setPickedAction] = useState<string>('주저할 시간도 아깝습니다. 주사위를 굴려 즉시 착수하세요!');
  const [isRolling, setIsRolling] = useState<boolean>(false);

  useEffect(() => {
    const savedActions = localStorage.getItem('sc_action_dice');
    if (savedActions) {
      try {
        setActions(JSON.parse(savedActions));
      } catch (e) {
        setActions(DEFAULT_ACTIONS.map((text, i) => ({ id: `${i}`, text })));
      }
    } else {
      setActions(DEFAULT_ACTIONS.map((text, i) => ({ id: `${i}`, text })));
    }

    const savedSessions = localStorage.getItem('sc_completed_sessions');
    if (savedSessions) {
      setCompletedSessions(parseInt(savedSessions, 10) || 0);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);
      localStorage.setItem('sc_completed_sessions', nextCount.toString());
      alert('🎉 15분 초집중 스프린트를 완료했습니다! 실행 근육이 단련되었습니다.');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, completedSessions]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const switchMode = (mins: number) => {
    setIsRunning(false);
    setTargetMinutes(mins);
    setTimeLeft(mins * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(targetMinutes * 60);
  };

  const rollDice = () => {
    if (actions.length === 0) return;
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * actions.length);
      setPickedAction(actions[randomIndex].text);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 80);
  };

  const addAction = () => {
    if (!newActionInput.trim()) return;
    const updated = [...actions, { id: Date.now().toString(), text: newActionInput.trim() }];
    setActions(updated);
    localStorage.setItem('sc_action_dice', JSON.stringify(updated));
    setNewActionInput('');
  };

  const removeAction = (id: string) => {
    const updated = actions.filter((a) => a.id !== id);
    setActions(updated);
    localStorage.setItem('sc_action_dice', JSON.stringify(updated));
  };

  const progressPercent = ((targetMinutes * 60 - timeLeft) / (targetMinutes * 60)) * 100;

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">08. 초집중 스프린트 & 액션 다이스</h2>
            <p className="text-xs text-slate-500">15분 타이머로 실행 격차를 줄이고 무작위 초소형 액션 뽑기</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          Focus Sprint
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* 좌측: 타이머 섹션 */}
        <div className="md:col-span-7 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center">
          {/* 타이머 시간 모드 선택 */}
          <div className="flex gap-1.5 p-1 bg-white border border-slate-200 rounded-xl mb-6">
            <button
              onClick={() => switchMode(15)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                targetMinutes === 15 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ 15분 액션
            </button>
            <button
              onClick={() => switchMode(25)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                targetMinutes === 25 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🍅 25분 뽀모도로
            </button>
            <button
              onClick={() => switchMode(5)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                targetMinutes === 5 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ☕ 5분 휴식
            </button>
          </div>

          {/* 원형 시계 */}
          <div className="relative w-56 h-56 flex flex-col items-center justify-center my-1">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#4f46e5"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-mono font-black text-slate-900 tracking-wider">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[11px] text-indigo-600 mt-1 font-bold">
                {isRunning ? '🔥 집중 실행 중' : '대기 중'}
              </span>
            </div>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRunning ? <Pause size={15} /> : <Play size={15} />}
              {isRunning ? '일시정지' : '스프린트 시작'}
            </button>
            <button
              onClick={resetTimer}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
              title="초기화"
            >
              <RotateCcw size={15} /> 초기화
            </button>
          </div>

          {/* 세션 카운트 */}
          <div className="mt-6 pt-3 border-t border-slate-200 w-full flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Flame size={15} className="text-amber-500" /> 오늘 완수한 세션
            </span>
            <div className="flex items-center gap-1 font-bold">
              <span className="text-base text-slate-900 font-mono">{completedSessions}</span>
              <span>회 달성</span>
            </div>
          </div>
        </div>

        {/* 우측: 15분 액션 다이스 룰렛 */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-indigo-50/60 border border-indigo-200/70 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                <Dices size={15} className="text-indigo-600" /> 액션 룰렛
              </span>
              <button
                onClick={rollDice}
                disabled={isRolling}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Dices size={13} className={isRolling ? 'animate-spin' : ''} />
                주사위 굴리기
              </button>
            </div>

            <div className="p-4 bg-white border border-indigo-100 rounded-xl min-h-[85px] flex items-center justify-center text-center shadow-xs">
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                "{pickedAction}"
              </p>
            </div>
          </div>

          {/* 커스텀 액션 등록 & 관리 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-indigo-600" /> 나만의 초소형 착수 풀 ({actions.length})
            </h3>

            <div className="flex gap-1.5">
              <input
                type="text"
                value={newActionInput}
                onChange={(e) => setNewActionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAction()}
                placeholder="15분 안에 즉시 할 작은 행동 입력..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={addAction}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Plus size={13} /> 추가
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {actions.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2 bg-white border border-slate-200/80 rounded-lg text-xs text-slate-700 hover:border-slate-300 transition"
                >
                  <span className="truncate pr-2">{act.text}</span>
                  <button
                    onClick={() => removeAction(act.id)}
                    className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}