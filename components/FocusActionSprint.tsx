'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Dices, Plus, Trash2, CheckCircle2, Flame } from 'lucide-react';

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
  // 타이머 상태 (기본 15분 초집중 = 900초, 25분 뽀모도로 = 1500초)
  const [targetMinutes, setTargetMinutes] = useState<number>(15);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  // 액션 다이스 상태
  const [actions, setActions] = useState<CustomAction[]>([]);
  const [newActionInput, setNewActionInput] = useState<string>('');
  const [pickedAction, setPickedAction] = useState<string>('주저할 시간도 아깝습니다. 주사위를 굴려 즉시 착수하세요!');
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // LocalStorage 데이터 복원
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

  // 타이머 인터벌
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

  // 시간 포맷 (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 모드 전환
  const switchMode = (mins: number) => {
    setIsRunning(false);
    setTargetMinutes(mins);
    setTimeLeft(mins * 60);
  };

  // 리셋
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(targetMinutes * 60);
  };

  // 주사위 굴리기 (랜덤 액션 도출)
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

  // 새 액션 추가
  const addAction = () => {
    if (!newActionInput.trim()) return;
    const updated = [...actions, { id: Date.now().toString(), text: newActionInput.trim() }];
    setActions(updated);
    localStorage.setItem('sc_action_dice', JSON.stringify(updated));
    setNewActionInput('');
  };

  // 액션 삭제
  const removeAction = (id: string) => {
    const updated = actions.filter((a) => a.id !== id);
    setActions(updated);
    localStorage.setItem('sc_action_dice', JSON.stringify(updated));
  };

  const progressPercent = ((targetMinutes * 60 - timeLeft) / (targetMinutes * 60)) * 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 상단 헤더 */}
      <div className="border-b border-slate-700/60 pb-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🎯</span> 초집중 15분 스프린트 & 액션 다이스
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          고민은 멈추고 주사위를 굴리세요. 15분만 타이머에 맞춰 손을 움직이면 실행 격차가 사라집니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 좌측: 타이머 섹션 */}
        <div className="lg:col-span-7 bg-slate-800/50 border border-slate-700/70 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
          {/* 타이머 시간 모드 선택 */}
          <div className="flex gap-2 p-1.5 bg-slate-900/60 rounded-xl mb-6">
            <button
              onClick={() => switchMode(15)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                targetMinutes === 15 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ 15분 초소형 액션
            </button>
            <button
              onClick={() => switchMode(25)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                targetMinutes === 25 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🍅 25분 뽀모도로
            </button>
            <button
              onClick={() => switchMode(5)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                targetMinutes === 5 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ☕ 5분 리프레시 휴식
            </button>
          </div>

          {/* 중앙 시계 텍스트 & 프로그레스 */}
          <div className="relative w-64 h-64 flex flex-col items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="#1e293b" strokeWidth="6" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#6366f1"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-mono font-black text-white tracking-wider">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs text-indigo-400 mt-2 font-medium">
                {isRunning ? '🔥 집중 실행 모드 가동 중' : '대기 중'}
              </span>
            </div>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition active:scale-95 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
              }`}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? '잠시 멈춤' : '스프린트 시작'}
            </button>
            <button
              onClick={resetTimer}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition"
              title="초기화"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* 완수한 스프린트 횟수 뱃지 */}
          <div className="mt-8 pt-4 border-t border-slate-700/60 w-full flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Flame size={16} className="text-amber-400" /> 오늘 완수한 세션
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-mono">{completedSessions}</span>
              <span className="text-slate-500">회 완료</span>
            </div>
          </div>
        </div>

        {/* 우측: 15분 액션 다이스 룰렛 */}
        <div className="lg:col-span-5 space-y-6">
          {/* 주사위 추첨 카드 */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-6 relative backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Dices size={16} /> 액션 룰렛
              </span>
              <button
                onClick={rollDice}
                disabled={isRolling}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-1.5"
              >
                <Dices size={14} className={isRolling ? 'animate-spin' : ''} />
                주사위 굴리기
              </button>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-700/50 rounded-xl min-h-[90px] flex items-center justify-center text-center">
              <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                "{pickedAction}"
              </p>
            </div>
          </div>

          {/* 사용자 커스텀 액션 등록 & 관리 */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-indigo-400" /> 나만의 초소형 착수 액션 풀 ({actions.length})
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newActionInput}
                onChange={(e) => setNewActionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAction()}
                placeholder="15분 안에 즉시 할 수 있는 초소형 행동 입력..."
                className="flex-1 bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={addAction}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus size={14} /> 추가
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {actions.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2.5 bg-slate-900/50 border border-slate-700/40 rounded-lg text-xs text-slate-300 group hover:border-slate-600 transition"
                >
                  <span className="truncate pr-2">{act.text}</span>
                  <button
                    onClick={() => removeAction(act.id)}
                    className="text-slate-500 hover:text-rose-400 transition opacity-80 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}