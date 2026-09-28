import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 });
    }

    // 1초 시뮬레이션 지연 (AI 분석 체감)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 간단한 텍스트 파싱 기반 KPT 카드 자동 생성
    // (OpenAI or Gemini API Key 추가 시 바로 연동 가능하도록 구조화)
    const sentences = content
      .split(/[.\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const keeps = sentences.filter((s) => /완료|성공|집중|좋았|배웠|해냈|뿌듯/.test(s));
    const problems = sentences.filter((s) => /아쉽|부족|집중이 안|어려|시간|지연|놓쳤|실패/.test(s));
    const tries = sentences.filter((s) => /내일|시도|계획|정리|해보|하기로/.test(s));

    const result = {
      summary: content.slice(0, 80) + (content.length > 80 ? '...' : ''),
      kpt: {
        keep: keeps.length > 0 ? keeps : ['오늘 계획했던 작업을 차근차근 시작하고 몰입한 점'],
        problem: problems.length > 0 ? problems : ['작업 중간에 우선순위 분배와 휴식 타이밍 조절이 다소 아쉬웠던 점'],
        tryNext: tries.length > 0 ? tries : ['내일은 가장 중요한 핵심 작업 1가지를 정하고 50분 집중 사이클 적용해보기']
      },
      actionItems: [
        '내일 아침 첫 30분 동안 진행할 Todo 1순위 확정하기',
        '작업 세션 간 10분 스트레칭 및 수분 섭취 루틴 지키기'
      ],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: '분석 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}