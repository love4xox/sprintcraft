'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRightCircle, ListChecks, 
  RotateCcw, Download, Heart, Upload, MessageSquare, Flame, Link2, Film, 
  ExternalLink, Plus, Trash2, Copy, Check, Music, Lightbulb, FileSpreadsheet, Activity,
  Palette, UserCircle2, FileText, Image as ImageIcon, Video, Clock, ChevronUp, ChevronDown, 
  Clapperboard, Mic, Sliders, Disc3, Radio, Star, Search, Filter, Share2, Tag
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import FocusActionSprint from '@/components/FocusActionSprint';

interface ReviewItem {
  id: string;
  review_date: string;
  rating: number;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  isDiscrepancy: boolean;
}

interface BioLinkItem {
  id: string;
  title: string;
  url: string;
}

interface StoryboardScene {
  id: string;
  shot: string;
  camera: string;
  prompt: string;
  tone: string;
  narration: string;
  duration: number;
  image?: string | null;
}

interface IdeaItem {
  id: string;
  category: '프로덕트' | '영상 기획' | '음악/사운드' | '디자인/UI';
  title: string;
  memo: string;
  status: '구상 중' | '진행 중' | '완료';
  isPinned: boolean;
  createdAt: string;
}

export default function OnePageHub() {
  const [activeTab, setActiveTab] = useState<'retro' | 'adopt' | 'radar' | 'bio' | 'story' | 'music' | 'idea' | 'focus'>('retro');
  const [isMounted, setIsMounted] = useState(false);

  // --- 1. 회고 아카이브 ---
  const [retroInput, setRetroInput] = useState('');
  const [retroResult, setRetroResult] = useState<{
    kpt: { keep: string[]; problem: string[]; tryNext: string[] };
    actionItems: string[];
  } | null>(null);

  // --- 2. 입양 카드 제너레이터 ---
  const [petName, setPetName] = useState('보리');
  const [petAge, setPetAge] = useState('1살 추정');
  const [petTags, setPetTags] = useState('사람좋아, 애교쟁이, 배변완벽');
  const [petStory, setPetStory] = useState('따뜻한 평생 가족을 기다리고 있어요. 산책을 정말 좋아합니다.');
  const [petImage, setPetImage] = useState<string | null>(null);
  const [cardTheme, setCardTheme] = useState<'cinematic' | 'polaroid' | 'urgent'>('cinematic');
  const [captionCopied, setCaptionCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- 3. 감성 트렌드 레이더 ---
  const [reviews, setReviews] = useState<ReviewItem[]>([
    { id: '1', review_date: '09-24', rating: 5, text: '배송 빠르고 포장도 꼼꼼해서 너무 좋아요!', sentiment: 'positive', isDiscrepancy: false },
    { id: '2', review_date: '09-24', rating: 5, text: '기능은 좋은데 UI가 너무 버벅거리고 불편하네요.', sentiment: 'negative', isDiscrepancy: true },
    { id: '3', review_date: '09-25', rating: 1, text: '최악입니다 실행조차 안 돼요.', sentiment: 'negative', isDiscrepancy: false },
    { id: '4', review_date: '09-25', rating: 5, text: '정말 만족스럽게 잘 쓰고 있습니다.', sentiment: 'positive', isDiscrepancy: false },
    { id: '5', review_date: '09-26', rating: 4, text: '괜찮은데 가끔 튕기는 현상 발생함.', sentiment: 'negative', isDiscrepancy: false },
    { id: '6', review_date: '09-27', rating: 5, text: '개발자 피드백 빠르고 아주 훌륭합니다.', sentiment: 'positive', isDiscrepancy: false },
  ]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewDate, setNewReviewDate] = useState('09-28');

  // --- 4. 링크인바이오 ---
  const [bioName, setBioName] = useState('Jung Dev');
  const [bioRole, setBioRole] = useState('AI Full-Stack Developer');
  const [bioAvatar, setBioAvatar] = useState<string | null>(null);
  const [bioTheme, setBioTheme] = useState<'dark' | 'gradient' | 'minimal'>('dark');
  const [links, setLinks] = useState<BioLinkItem[]>([
    { id: '1', title: 'GitHub Profile', url: 'https://github.com' },
    { id: '2', title: 'Tech Blog (Next.js & AI)', url: 'https://velog.io' },
    { id: '3', title: 'Portfolio Project Showcase', url: '#' },
  ]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // --- 5. 스토리보드 캔버스 ---
  const [scenes, setScenes] = useState<StoryboardScene[]>([
    {
      id: '1',
      shot: 'Wide Shot',
      camera: 'Push In (천천히 전진)',
      prompt: '비 내리는 사이버펑크 도시의 골목길, 푸른 네온사인과 젖은 아스팔트에 반사된 빛, 4K 시네마틱',
      tone: 'Dark Synthwave Ambient, 빗소리 ASMR',
      narration: '어둠이 짙게 깔린 도시, 하나의 터미널이 깨어난다.',
      duration: 4,
      image: null
    },
    {
      id: '2',
      shot: 'Extreme Close-up',
      camera: 'Static (고정)',
      prompt: '모니터에 반사된 개발자의 집중된 눈빛, 깜빡이는 커서와 고속으로 올라가는 초록색 코드 콘솔',
      tone: 'Fast Electronic Synth, 긴장감 고조',
      narration: '마지막 배포까지 남은 시간은 단 10초.',
      duration: 3,
      image: null
    }
  ]);
  const [copiedScene, setCopiedScene] = useState(false);

  // --- 6. 음악 프롬프트 랩 ---
  const [musicGenre, setMusicGenre] = useState('Synthwave');
  const [musicMoods, setMusicMoods] = useState<string[]>(['Nostalgic', 'Energetic']);
  const [musicInstruments, setMusicInstruments] = useState<string[]>(['Analog Synthesizer', '808 Drums', 'Bassline']);
  const [musicBpm, setMusicBpm] = useState(115);
  const [vocalType, setVocalType] = useState<'instrumental' | 'female' | 'male' | 'duet'>('instrumental');
  const [includeLyricsMeta, setIncludeLyricsMeta] = useState(false);
  const [copiedMusic, setCopiedMusic] = useState(false);

  // --- 7. 아이디어 스파크 아카이브 고도화 상태 ---
  const [ideas, setIdeas] = useState<IdeaItem[]>([
    {
      id: '1',
      category: '프로덕트',
      title: '생각 vs 실행 점수 기반 AI 코치',
      memo: '생각만 많은 사람들을 위해 계획 대비 행동 전환율을 일간 리포트로 제공하는 개인화 생산성 서비스',
      status: '진행 중',
      isPinned: true,
      createdAt: '09-28'
    },
    {
      id: '2',
      category: '영상 기획',
      title: '비 오는 날의 로파이 프로그래밍 숏폼',
      memo: '기계식 키보드 타이핑 ASMR과 창밖 빗소리를 배경으로 미니 프로젝트 3시간 완성 챌린지 릴스',
      status: '구상 중',
      isPinned: false,
      createdAt: '09-27'
    },
    {
      id: '3',
      category: '디자인/UI',
      title: '다크모드 글래스모피즘 HUD 대시보드',
      memo: 'Next.js 14 서버 컴포넌트와 Tailwind CSS 기반 모듈형 위젯 인터페이스',
      status: '완료',
      isPinned: false,
      createdAt: '09-26'
    }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newMemo, setNewMemo] = useState('');
  const [newCategory, setNewCategory] = useState<'프로덕트' | '영상 기획' | '음악/사운드' | '디자인/UI'>('프로덕트');
  const [filterCategory, setFilterCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedExport, setCopiedExport] = useState(false);

  // -------------------------------------------------------------
  // LocalStorage 마운트 및 복원
  // -------------------------------------------------------------
  useEffect(() => {
    try {
      const savedRetro = localStorage.getItem('sc_retro');
      if (savedRetro) {
        const parsed = JSON.parse(savedRetro);
        setRetroInput(parsed.input || '');
        setRetroResult(parsed.result || null);
      }
      const savedAdopt = localStorage.getItem('sc_adopt');
      if (savedAdopt) {
        const parsed = JSON.parse(savedAdopt);
        if (parsed.name) setPetName(parsed.name);
        if (parsed.age) setPetAge(parsed.age);
        if (parsed.tags) setPetTags(parsed.tags);
        if (parsed.story) setPetStory(parsed.story);
        if (parsed.theme) setCardTheme(parsed.theme);
        if (parsed.image) setPetImage(parsed.image);
      }
      const savedReviews = localStorage.getItem('sc_reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));
      const savedBio = localStorage.getItem('sc_bio');
      if (savedBio) {
        const parsed = JSON.parse(savedBio);
        if (parsed.name) setBioName(parsed.name);
        if (parsed.role) setBioRole(parsed.role);
        if (parsed.theme) setBioTheme(parsed.theme);
        if (parsed.links) setLinks(parsed.links);
        if (parsed.avatar) setBioAvatar(parsed.avatar);
      }
      const savedScenes = localStorage.getItem('sc_scenes');
      if (savedScenes) setScenes(JSON.parse(savedScenes));
      const savedMusic = localStorage.getItem('sc_music');
      if (savedMusic) {
        const parsed = JSON.parse(savedMusic);
        if (parsed.genre) setMusicGenre(parsed.genre);
        if (parsed.moods) setMusicMoods(parsed.moods);
        if (parsed.instruments) setMusicInstruments(parsed.instruments);
        if (parsed.bpm) setMusicBpm(parsed.bpm);
        if (parsed.vocal) setVocalType(parsed.vocal);
        if (parsed.includeLyrics !== undefined) setIncludeLyricsMeta(parsed.includeLyrics);
      }
      const savedIdeas = localStorage.getItem('sc_ideas');
      if (savedIdeas) {
        const parsed = JSON.parse(savedIdeas);
        const migrated: IdeaItem[] = parsed.map((item: any, idx: number) => ({
          id: item.id?.toString() || `${Date.now()}-${idx}`,
          category: item.category || '프로덕트',
          title: item.title || '',
          memo: item.memo || '',
          status: item.status || '구상 중',
          isPinned: item.isPinned || false,
          createdAt: item.createdAt || '09-28'
        }));
        setIdeas(migrated);
      }
    } catch (e) {
      console.error(e);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('sc_retro', JSON.stringify({ input: retroInput, result: retroResult }));
  }, [retroInput, retroResult, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('sc_adopt', JSON.stringify({ name: petName, age: petAge, tags: petTags, story: petStory, theme: cardTheme, image: petImage }));
  }, [petName, petAge, petTags, petStory, cardTheme, petImage, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('sc_reviews', JSON.stringify(reviews));
  }, [reviews, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('sc_bio', JSON.stringify({ name: bioName, role: bioRole, theme: bioTheme, links, avatar: bioAvatar }));
  }, [bioName, bioRole, bioTheme, links, bioAvatar, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('sc_scenes', JSON.stringify(scenes));
  }, [scenes, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('sc_music', JSON.stringify({
      genre: musicGenre,
      moods: musicMoods,
      instruments: musicInstruments,
      bpm: musicBpm,
      vocal: vocalType,
      includeLyrics: includeLyricsMeta
    }));
  }, [musicGenre, musicMoods, musicInstruments, musicBpm, vocalType, includeLyricsMeta, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('sc_ideas', JSON.stringify(ideas));
  }, [ideas, isMounted]);

  // -------------------------------------------------------------
  // 공통 핸들러
  // -------------------------------------------------------------
  const handleRetroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retroInput.trim()) return alert('내용을 입력해주세요!');
    const sentences = retroInput.split(/[.\n]/).map(s => s.trim()).filter(Boolean);
    const keeps = sentences.filter(s => /완료|성공|집중|좋았|배웠|해냈|뿌듯/.test(s));
    const problems = sentences.filter(s => /아쉽|부족|어려|시간|지연|놓쳤|실패|버벅|많/.test(s));
    const tries = sentences.filter(s => /내일|시도|계획|정리|해보|하기로/.test(s));

    setRetroResult({
      kpt: {
        keep: keeps.length > 0 ? keeps : ['머릿속 생각을 멈추지 않고 글로 솔직하게 작성한 점'],
        problem: problems.length > 0 ? problems : ['생각이 많아 즉각적인 액션 전환이 지연된 점'],
        tryNext: tries.length > 0 ? tries : ['3개 핵심 키워드로 압축 후 1시간 단위 작업 시작하기']
      },
      actionItems: ['가장 먼저 끝낼 수 있는 초소형 액션 1개 실행하기', '작업 전환 시 10분 스트레칭 및 마인드셋 정돈']
    });
  };

  const applyPetPreset = (preset: { name: string; age: string; tags: string; story: string }) => {
    setPetName(preset.name);
    setPetAge(preset.age);
    setPetTags(preset.tags);
    setPetStory(preset.story);
  };

  const handleCopyCaption = () => {
    const tagList = petTags.split(',').map(t => `#${t.trim()}`).join(' ');
    const caption = `[가족을 찾아요 🐾]
이름: ${petName} (${petAge})

"${petStory}"

${tagList} #사지말고입양하세요 #유기견입양 #유기묘입양 #평생가족을기다려요`;

    navigator.clipboard.writeText(caption);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `입양홍보_${petName}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('카드 다운로드에 실패했습니다.');
    }
  };

  const analyzeSentiment = (text: string, rating: number) => {
    const posPattern = /좋|만족|빠르|최고|훌륭|감사|추천|깔끔/;
    const negPattern = /불편|버벅|느림|최악|튕김|오류|실망|아쉽|어려/;
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (posPattern.test(text)) sentiment = 'positive';
    if (negPattern.test(text)) sentiment = 'negative';
    const isDiscrepancy = (rating >= 4 && sentiment === 'negative') || (rating <= 2 && sentiment === 'positive');
    return { sentiment, isDiscrepancy };
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const { sentiment, isDiscrepancy } = analyzeSentiment(newReviewText, Number(newReviewRating));
    setReviews([{
      id: Date.now().toString(),
      review_date: newReviewDate,
      rating: Number(newReviewRating),
      text: newReviewText,
      sentiment,
      isDiscrepancy
    }, ...reviews]);
    setNewReviewText('');
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const parsed: ReviewItem[] = [];
      lines.forEach((line, idx) => {
        if (idx === 0 && line.includes('date')) return;
        const [date, ratingStr, ...rest] = line.split(',');
        const content = rest.join(',').replace(/^"|"$/g, '');
        if (date && content) {
          const rating = Number(ratingStr) || 5;
          const { sentiment, isDiscrepancy } = analyzeSentiment(content, rating);
          parsed.push({
            id: `${Date.now()}-${idx}`,
            review_date: date.trim(),
            rating,
            text: content.trim(),
            sentiment,
            isDiscrepancy
          });
        }
      });
      if (parsed.length > 0) {
        setReviews([...parsed, ...reviews]);
        alert(`${parsed.length}건 추가 완료`);
      }
    };
    reader.readAsText(file);
  };

  const chartData = useMemo(() => {
    const dateMap: { [key: string]: { positive: number; negative: number; discrepancy: number; total: number } } = {};
    reviews.forEach(r => {
      if (!dateMap[r.review_date]) dateMap[r.review_date] = { positive: 0, negative: 0, discrepancy: 0, total: 0 };
      dateMap[r.review_date].total += 1;
      if (r.sentiment === 'positive') dateMap[r.review_date].positive += 1;
      if (r.sentiment === 'negative') dateMap[r.review_date].negative += 1;
      if (r.isDiscrepancy) dateMap[r.review_date].discrepancy += 1;
    });
    return Object.keys(dateMap).sort().map(date => {
      const row = dateMap[date];
      return {
        review_date: date,
        positive: Math.round((row.positive / row.total) * 100),
        negative: Math.round((row.negative / row.total) * 100),
        discrepancy: Math.round((row.discrepancy / row.total) * 100),
      };
    });
  }, [reviews]);

  const summaryMetrics = useMemo(() => {
    if (reviews.length === 0) return { pos: 0, neg: 0, disc: 0 };
    const posCount = reviews.filter(r => r.sentiment === 'positive').length;
    const negCount = reviews.filter(r => r.sentiment === 'negative').length;
    const discCount = reviews.filter(r => r.isDiscrepancy).length;
    return {
      pos: ((posCount / reviews.length) * 100).toFixed(1),
      neg: ((negCount / reviews.length) * 100).toFixed(1),
      disc: ((discCount / reviews.length) * 100).toFixed(1),
    };
  }, [reviews]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return alert('제목과 링크 주소를 모두 입력해주세요.');
    let url = newLinkUrl.trim();
    if (!/^https?:\/\//i.test(url) && url !== '#') {
      url = 'https://' + url;
    }
    setLinks([...links, { id: Date.now().toString(), title: newLinkTitle.trim(), url }]);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };
  const handleRemoveLink = (id: string) => setLinks(links.filter(l => l.id !== id));
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBioAvatar(URL.createObjectURL(file));
  };

  // 스토리보드 핸들러
  const addScene = () => {
    setScenes([...scenes, {
      id: Date.now().toString(),
      shot: 'Medium Shot',
      camera: 'Static (고정)',
      prompt: '',
      tone: 'Ambient Calm',
      narration: '',
      duration: 4,
      image: null
    }]);
  };
  const removeScene = (id: string) => setScenes(scenes.filter(s => s.id !== id));
  const updateScene = (id: string, field: keyof StoryboardScene, value: any) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const moveScene = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= scenes.length) return;
    const newArr = [...scenes];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setScenes(newArr);
  };
  const handleSceneImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateScene(id, 'image', URL.createObjectURL(file));
  };
  const copyScript = () => {
    const text = scenes.map((s, i) => `[SCENE ${i + 1} • ${s.shot} (${s.duration}s)]\n- 카메라: ${s.camera}\n- 비주얼: ${s.prompt || '(미입력)'}\n- 오디오: ${s.tone || '(미입력)'}\n- 내레이션: ${s.narration || '(미입력)'}\n`).join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopiedScene(true);
    setTimeout(() => setCopiedScene(false), 2000);
  };
  const totalRuntime = useMemo(() => scenes.reduce((acc, cur) => acc + (Number(cur.duration) || 0), 0), [scenes]);

  // 음악 핸들러
  const genreOptions = ['Synthwave', 'Lo-fi Hip Hop', 'K-Pop', 'Cyberpunk Industrial', 'Cinematic Orchestral', 'City Pop', 'R&B Neo Soul', 'Acoustic Indie'];
  const moodOptions = ['Nostalgic', 'Energetic', 'Dark', 'Chill', 'Dreamy', 'Melancholic', 'Epic', 'Uplifting'];
  const instrumentOptions = ['Analog Synthesizer', '808 Drums', 'Bassline', 'Grand Piano', 'Electric Guitar', 'Rain Sound ASMR', 'Violin Strings', 'Brass Horns'];

  const toggleMood = (tag: string) => setMusicMoods(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const toggleInstrument = (tag: string) => setMusicInstruments(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const applyMusicPreset = (preset: 'cyberpunk' | 'lofi' | 'kpop' | 'epic') => {
    if (preset === 'cyberpunk') {
      setMusicGenre('Cyberpunk Industrial');
      setMusicMoods(['Dark', 'Energetic', 'Epic']);
      setMusicInstruments(['Analog Synthesizer', '808 Drums', 'Bassline']);
      setMusicBpm(128);
      setVocalType('instrumental');
    } else if (preset === 'lofi') {
      setMusicGenre('Lo-fi Hip Hop');
      setMusicMoods(['Chill', 'Nostalgic', 'Dreamy']);
      setMusicInstruments(['Grand Piano', 'Rain Sound ASMR', 'Bassline']);
      setMusicBpm(82);
      setVocalType('instrumental');
    } else if (preset === 'kpop') {
      setMusicGenre('K-Pop');
      setMusicMoods(['Energetic', 'Uplifting']);
      setMusicInstruments(['808 Drums', 'Analog Synthesizer', 'Electric Guitar']);
      setMusicBpm(120);
      setVocalType('female');
    } else {
      setMusicGenre('Cinematic Orchestral');
      setMusicMoods(['Epic', 'Melancholic']);
      setMusicInstruments(['Violin Strings', 'Brass Horns', 'Grand Piano']);
      setMusicBpm(90);
      setVocalType('instrumental');
    }
  };

  const getCombinedMusicPrompt = () => {
    const vocalStr = vocalType === 'instrumental' ? 'Instrumental, No Vocals' : `${vocalType.toUpperCase()} Vocal, Melodic Catchy Topline`;
    const base = `[Style: ${musicGenre}] [Mood: ${musicMoods.join(', ') || 'Neutral'}] [Instruments: ${musicInstruments.join(', ') || 'Default'}] [Tempo: ${musicBpm} BPM] [Vocals: ${vocalStr}] - High Fidelity Studio Master`;
    if (!includeLyricsMeta) return base;
    return `${base}\n\n[Intro - Ambient Build]\n[Verse 1]\n모니터 너머 번져오는 푸른 빛\n깜빡이는 커서 위에 얹은 꿈들\n[Chorus - High Energy Drop]\nRun it now, break the ceiling high!\n끝없이 뻗어나갈 내일의 멜로디\n[Outro - Slow Fade Out]`;
  };

  const copyMusicPrompt = () => {
    navigator.clipboard.writeText(getCombinedMusicPrompt());
    setCopiedMusic(true);
    setTimeout(() => setCopiedMusic(false), 2000);
  };

  // --- 7. 아이디어 아카이브 전용 핸들러 ---
  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const now = new Date();
    const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newItem: IdeaItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      memo: newMemo.trim(),
      category: newCategory,
      status: '구상 중',
      isPinned: false,
      createdAt: dateStr
    };
    setIdeas([newItem, ...ideas]);
    setNewTitle('');
    setNewMemo('');
  };

  const handleTogglePin = (id: string) => {
    setIdeas(ideas.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item));
  };

  const handleChangeStatus = (id: string, status: '구상 중' | '진행 중' | '완료') => {
    setIdeas(ideas.map(item => item.id === id ? { ...item, status } : item));
  };

  const handleRemoveIdea = (id: string) => {
    setIdeas(ideas.filter(item => item.id !== id));
  };

  const handleExportIdeas = () => {
    const text = filteredIdeas.map((item, idx) => {
      return `### ${idx + 1}. [${item.category}] ${item.title} (${item.status})
- 등록일: ${item.createdAt}
- 메모/기획: ${item.memo || '(내용 없음)'}
`;
    }).join('\n----------------------------------------\n\n');

    navigator.clipboard.writeText(text);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  // 아이디어 필터링 & 정렬 (핀 고정 우선)
  const filteredIdeas = useMemo(() => {
    return ideas
      .filter(item => {
        const matchesCategory = filterCategory === '전체' || item.category === filterCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.memo.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [ideas, filterCategory, searchQuery]);

  const navItems = [
    { id: 'retro', label: '1. 회고' },
    { id: 'adopt', label: '2. 입양카드' },
    { id: 'radar', label: '3. 감성레이더' },
    { id: 'bio', label: '4. 링크인바이오' },
    { id: 'story', label: '5. 스토리보드' },
    { id: 'music', label: '6. 음악 랩' },
    { id: 'idea', label: '7. 아이디어 아카이브' },
    { id: 'focus', label: '8. 초집중 스프린트 & 액션 다이스' },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">SprintCraft</span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">v1.0</span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeTab === item.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-8">

        {/* 1. 회고 아카이브 */}
        {activeTab === 'retro' && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><MessageSquare className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">01. 1인 스프린트 AI 회고 아카이브</h2>
                  <p className="text-xs text-slate-500">자유로운 회고를 KPT 및 실행 액션으로 구조화</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">NLP Parsing</span>
            </div>
            <form onSubmit={handleRetroSubmit} className="space-y-4">
              <textarea
                rows={4}
                value={retroInput}
                onChange={(e) => setRetroInput(e.target.value)}
                placeholder="오늘 하루 한 일이나 생각을 자유롭게 적어보세요..."
                className="w-full rounded-2xl border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
              />
              <div className="flex justify-end gap-2">
                {retroResult && (
                  <button type="button" onClick={() => { setRetroInput(''); setRetroResult(null); }} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition cursor-pointer">
                    <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> 초기화
                  </button>
                )}
                <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5" /> KPT 카드 생성
                </button>
              </div>
            </form>
            {retroResult && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Keep</span>
                    <ul className="text-xs text-emerald-950 space-y-1.5">{retroResult.kpt.keep.map((k, i) => <li key={i} className="bg-white/80 p-2 rounded-lg border border-emerald-100">{k}</li>)}</ul>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Problem</span>
                    <ul className="text-xs text-amber-950 space-y-1.5">{retroResult.kpt.problem.map((p, i) => <li key={i} className="bg-white/80 p-2 rounded-lg border border-amber-100">{p}</li>)}</ul>
                  </div>
                  <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-800"><ArrowRightCircle className="w-3.5 h-3.5 text-blue-600" /> Try</span>
                    <ul className="text-xs text-blue-950 space-y-1.5">{retroResult.kpt.tryNext.map((t, i) => <li key={i} className="bg-white/80 p-2 rounded-lg border border-blue-100">{t}</li>)}</ul>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700"><ListChecks className="w-4 h-4 text-indigo-600" /> 내일의 Action Item</span>
                  {retroResult.actionItems.map((act, i) => (
                    <label key={i} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/60 text-xs text-slate-700 cursor-pointer">
                      <input type="checkbox" className="rounded text-indigo-600" />
                      <span>{act}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 2. 유기동물 입양 카드 */}
        {activeTab === 'adopt' && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><Heart className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">02. 유기동물 입양 홍보 콘텐츠 제너레이터</h2>
                  <p className="text-xs text-slate-500">인스타그램 규격 카드 실시간 렌더링 & 원클릭 이미지·본문 복사</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">DOM to Canvas</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-500 mr-1">빠른 예시 로드:</span>
              <button
                type="button"
                onClick={() => applyPetPreset({ name: '보리', age: '1살 추정 (믹스)', tags: '사람좋아, 애교쟁이, 배변완벽', story: '따뜻한 평생 가족을 기다리고 있어요. 산책을 정말 좋아합니다.' })}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                🐶 보리
              </button>
              <button
                type="button"
                onClick={() => applyPetPreset({ name: '나비', age: '2살 추정 (코숏)', tags: '골골송대장, 무릎냥이, 온순함', story: '조용하고 다정한 성격의 고양이입니다. 볕 좋은 창가를 좋아해요.' })}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                🐱 나비
              </button>
              <button
                type="button"
                onClick={() => applyPetPreset({ name: '초코', age: '8개월 (푸들 믹스)', tags: '호기심왕, 활발함, 친화력갑', story: '장난감 놀이를 매우 좋아하는 활발한 친구입니다. 사랑으로 품어주세요.' })}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                🐕 초코
              </button>
              <button
                type="button"
                onClick={() => applyPetPreset({ name: '뭉치', age: '3살 (말티즈 믹스)', tags: '얌전함, 분리불안없음, 건강함', story: '차분하게 곁을 지켜주는 든든한 댕댕이입니다. 평생의 단짝이 되어주세요.' })}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                🐾 뭉치
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">동물 사진 업로드</label>
                  <label className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-3.5 cursor-pointer hover:border-rose-400 bg-slate-50 transition">
                    <Upload className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-xs font-medium text-slate-500">
                      {petImage ? '다른 사진으로 변경하기' : '사진 선택 (정사각형 권장)'}
                    </span>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setPetImage(URL.createObjectURL(e.target.files[0]))} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">이름</label>
                    <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="이름" className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">나이 / 품종</label>
                    <input type="text" value={petAge} onChange={(e) => setPetAge(e.target.value)} placeholder="나이/품종" className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">특징 태그 (쉼표로 구분)</label>
                  <input type="text" value={petTags} onChange={(e) => setPetTags(e.target.value)} placeholder="사람좋아, 애교쟁이, 배변완벽" className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500" />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">소개 문구</label>
                  <textarea rows={3} value={petStory} onChange={(e) => setPetStory(e.target.value)} placeholder="아이의 성격이나 구조 사연을 적어주세요..." className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 resize-none" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-rose-500" /> 카드 템플릿 디자인
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCardTheme('cinematic')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        cardTheme === 'cinematic' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      시네마틱
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardTheme('polaroid')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        cardTheme === 'polaroid' ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      폴라로이드
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardTheme('urgent')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        cardTheme === 'urgent' ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      긴급 임팩트
                    </button>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button onClick={handleDownloadCard} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                    <Download className="w-4 h-4" /> 인스타그램 카드뉴스 PNG 다운로드 (고화질)
                  </button>
                  <button onClick={handleCopyCaption} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                    {captionCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4" />}
                    {captionCopied ? '인스타그램 본문 복사 완료!' : '인스타그램 업로드 본문 & 해시태그 복사'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 mb-2 font-medium">1:1 인스타그램 규격 실시간 미리보기</span>

                {cardTheme === 'cinematic' && (
                  <div ref={cardRef} className="w-[300px] aspect-square rounded-3xl overflow-hidden relative shadow-2xl bg-slate-900 p-6 flex flex-col justify-end select-none">
                    {petImage ? (
                      <img src={petImage} alt={petName} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 via-rose-300 to-indigo-300 flex flex-col items-center justify-center text-amber-950/70 p-4 text-center">
                        <ImageIcon className="w-8 h-8 opacity-50 mb-1" />
                        <span className="text-xs font-bold">사진을 업로드하면 배경에 적용됩니다</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                    <div className="absolute top-5 left-5 bg-rose-500/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md">
                      <Heart className="w-3 h-3 fill-white" /> 평생 가족을 찾아요
                    </div>
                    <div className="relative z-10 text-white space-y-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black tracking-tight">{petName}</span>
                        <span className="text-xs text-slate-300 font-medium">{petAge}</span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-2 font-light leading-relaxed">{petStory}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {petTags.split(',').map((t, i) => (
                          <span key={i} className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/20">
                            #{t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {cardTheme === 'polaroid' && (
                  <div ref={cardRef} className="w-[300px] aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white p-4 flex flex-col justify-between select-none border border-slate-200">
                    <div className="w-full h-[65%] rounded-2xl overflow-hidden relative bg-slate-100">
                      {petImage ? (
                        <img src={petImage} alt={petName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-rose-50 text-rose-400 text-xs font-bold">
                          사진 업로드 대기중
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/90 text-rose-600 text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        ADOPT ME
                      </div>
                    </div>
                    <div className="h-[30%] flex flex-col justify-center space-y-1 px-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-black text-slate-900">{petName}</span>
                        <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">{petAge}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">{petStory}</p>
                      <div className="flex gap-1 overflow-hidden">
                        {petTags.split(',').map((t, i) => (
                          <span key={i} className="text-[9px] font-bold text-slate-500">#{t.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {cardTheme === 'urgent' && (
                  <div ref={cardRef} className="w-[300px] aspect-square rounded-3xl overflow-hidden relative shadow-2xl bg-amber-400 p-5 flex flex-col justify-between select-none border-4 border-slate-950">
                    <div className="flex items-center justify-between">
                      <span className="bg-slate-950 text-amber-400 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        🚨 긴급 입양 공고
                      </span>
                      <span className="text-xs font-black text-slate-950">{petAge}</span>
                    </div>

                    <div className="w-full h-[52%] rounded-2xl overflow-hidden border-2 border-slate-950 relative my-1 bg-white">
                      {petImage ? (
                        <img src={petImage} alt={petName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                          사진을 등록해주세요
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-950 tracking-tight">{petName}</h3>
                      <p className="text-xs text-slate-900 font-bold line-clamp-1 leading-tight">{petStory}</p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {petTags.split(',').map((t, i) => (
                          <span key={i} className="bg-slate-950 text-white px-2 py-0.5 rounded-md text-[9px] font-black">
                            #{t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3. 감성 트렌드 대시보드 */}
        {activeTab === 'radar' && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Flame className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">03. 소셜/리뷰 감성 트렌드 레이더</h2>
                  <p className="text-xs text-slate-500">실데이터 파싱, 시계열 추이 집계 및 감성 불일치 로그 뷰어</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-amber-200 cursor-pointer">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" /> CSV 업로드
                  <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                </label>
              </div>
            </div>

            <form onSubmit={handleAddReview} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-500" /> 실시간 리뷰 수기 입력 / 즉시 분석 테스트
                </span>
                <span className="text-[11px] text-slate-400">총 {reviews.length}건 수집됨</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={newReviewDate}
                  onChange={(e) => setNewReviewDate(e.target.value)}
                  placeholder="날짜 (예: 09-28)"
                  className="w-24 text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-24 text-xs font-semibold p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value={5}>⭐ 5점</option>
                  <option value={4}>⭐ 4점</option>
                  <option value={3}>⭐ 3점</option>
                  <option value={2}>⭐ 2점</option>
                  <option value={1}>⭐ 1점</option>
                </select>
                <input
                  type="text"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="리뷰 내용 입력 (예: 별점은 높지만 버벅거림이 심해서 불편함)"
                  className="flex-1 min-w-[200px] text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  리뷰 등록
                </button>
              </div>
            </form>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500">평균 긍정 비율</span>
                <p className="text-xl font-black text-emerald-600 mt-1">{summaryMetrics.pos}%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500">평균 부정 비율</span>
                <p className="text-xl font-black text-rose-500 mt-1">{summaryMetrics.neg}%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500">평점-감성 불일치율</span>
                <p className="text-xl font-black text-indigo-600 mt-1">{summaryMetrics.disc}%</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">일자별 감성 추이 (Auto-Aggregated)</span>
              <div className="h-60 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="review_date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }} />
                    <Line type="monotone" dataKey="positive" name="긍정 여론 (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="negative" name="부정 여론 (%)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="discrepancy" name="불일치율 (%)" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">모니터링 피드 & 이상 징후 감지 로그</span>
                <button onClick={() => setReviews([])} className="text-[11px] text-slate-400 hover:text-rose-500 transition">전체 초기화</button>
              </div>
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {reviews.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs transition">
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">{r.review_date}</span>
                        <span className="text-amber-500 font-bold">{'⭐'.repeat(r.rating)}</span>
                        {r.isDiscrepancy && (
                          <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-[9px] rounded-md border border-indigo-200">
                            ⚠️ 불일치 감지
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 font-medium line-clamp-1">{r.text}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      r.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                      r.sentiment === 'negative' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {r.sentiment === 'positive' ? '긍정' : r.sentiment === 'negative' ? '부정' : '중립'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. 링크인바이오 */}
        {activeTab === 'bio' && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Link2 className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">04. 링크인바이오 프로필 빌더</h2>
                  <p className="text-xs text-slate-500">개인 브랜딩 허브, 테마 커스텀 및 다이내믹 링크 관리</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Interactive Mockup</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">기본 프로필 정보</label>
                    <label className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer flex items-center gap-1">
                      <UserCircle2 className="w-3.5 h-3.5" /> 사진 업로드
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={bioName}
                    onChange={(e) => setBioName(e.target.value)}
                    placeholder="이름 / 닉네임"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={bioRole}
                    onChange={(e) => setBioRole(e.target.value)}
                    placeholder="직무 / 한 줄 슬로건"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-600" /> 모바일 테마 스타일
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setBioTheme('dark')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        bioTheme === 'dark' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      다크 옵시디언
                    </button>
                    <button
                      type="button"
                      onClick={() => setBioTheme('gradient')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        bioTheme === 'gradient' ? 'border-purple-600 bg-gradient-to-tr from-indigo-900 to-purple-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      퍼플 오로라
                    </button>
                    <button
                      type="button"
                      onClick={() => setBioTheme('minimal')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        bioTheme === 'minimal' ? 'border-slate-400 bg-white text-slate-900 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      모던 클린
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddLink} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-indigo-600" /> 새 링크 추가
                  </span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      placeholder="버튼 이름 (예: Velog 기술 블로그)"
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                    />
                    <input
                      type="text"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="URL (예: https://velog.io/@username)"
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> 링크 추가
                    </button>
                  </div>
                </form>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700">등록된 링크 관리 ({links.length}개)</span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {links.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <div className="truncate pr-2">
                          <p className="font-semibold text-slate-800">{link.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{link.url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(link.id)}
                          className="text-slate-400 hover:text-rose-500 transition p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 mb-2 font-medium">모바일 뷰 실시간 반영</span>
                <div className={`w-[290px] rounded-[36px] p-6 shadow-2xl border-4 transition-all duration-300 space-y-6 ${
                  bioTheme === 'dark' 
                    ? 'bg-slate-900 border-slate-800 text-white' 
                    : bioTheme === 'gradient'
                    ? 'bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-950 border-purple-900 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900 shadow-lg'
                }`}>
                  <div className="text-center space-y-2 pt-2">
                    <div className="w-16 h-16 rounded-full mx-auto overflow-hidden ring-2 ring-indigo-500/50 flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xl shadow-md">
                      {bioAvatar ? (
                        <img src={bioAvatar} alt={bioName} className="w-full h-full object-cover" />
                      ) : (
                        bioName.slice(0, 1).toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm tracking-tight">{bioName || '이름을 입력하세요'}</h3>
                      <p className={`text-[11px] font-medium mt-0.5 ${bioTheme === 'minimal' ? 'text-slate-500' : 'text-slate-300'}`}>
                        {bioRole || '직무 소개를 적어보세요'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pb-2">
                    {links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-semibold border transition transform active:scale-95 ${
                          bioTheme === 'dark'
                            ? 'bg-slate-800/90 hover:bg-slate-700/90 text-white border-slate-700/70 shadow-sm'
                            : bioTheme === 'gradient'
                            ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-white/20 shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/80 shadow-xs'
                        }`}
                      >
                        <span className="truncate pr-2">{link.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                      </a>
                    ))}
                    {links.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400">
                        등록된 링크가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. 스토리보드 캔버스 */}
        {activeTab === 'story' && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl"><Film className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">05. 멀티모달 스토리보드 캔버스</h2>
                  <p className="text-xs text-slate-500">16:9 프레임 뷰포트, 카메라 워크, 비주얼 & 오디오 프롬프트 설계</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyScript} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition flex items-center gap-1 cursor-pointer">
                  {copiedScene ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedScene ? '스크립트 복사됨!' : '전체 스크립트 복사'}
                </button>
                <button onClick={addScene} className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-xl text-xs font-semibold text-white transition flex items-center gap-1 shadow-sm cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> 씬 추가
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Clapperboard className="w-3.5 h-3.5 text-violet-500" /> 프리셋:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setScenes([
                      { id: '1', shot: 'Wide Shot', camera: 'Push In (천천히 전진)', prompt: '비 내리는 사이버펑크 도시 골목, 네온사인 반영', tone: 'Dark Synthwave', narration: '도시의 전산망이 점멸하기 시작했다.', duration: 4, image: null },
                      { id: '2', shot: 'Close-up', camera: 'Static', prompt: '모니터에 비친 집중된 눈빛, 초록색 코드 콘솔', tone: 'Fast Synth', narration: '단 하나의 알고리즘이 모든 것을 바꾼다.', duration: 3, image: null }
                    ]);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  🚀 SF 사이버펑크
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1 text-slate-500">
                  <Film className="w-3.5 h-3.5 text-slate-400" /> 총 {scenes.length}개 씬
                </span>
                <span className="flex items-center gap-1 text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100">
                  <Clock className="w-3.5 h-3.5 text-violet-500" /> 총 예상 {totalRuntime}초
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {scenes.map((scene, idx) => (
                <div key={scene.id} className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:border-violet-200 transition space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-violet-600 text-white font-black text-xs">
                        SCENE {idx + 1}
                      </span>
                      <select
                        value={scene.shot}
                        onChange={(e) => updateScene(scene.id, 'shot', e.target.value)}
                        className="text-xs font-bold p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                      >
                        <option>Wide Shot</option>
                        <option>Close-up</option>
                        <option>Medium Shot</option>
                        <option>Extreme Close-up</option>
                        <option>Drone View</option>
                      </select>
                      <select
                        value={scene.camera}
                        onChange={(e) => updateScene(scene.id, 'camera', e.target.value)}
                        className="text-xs font-semibold p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                      >
                        <option>Static (고정)</option>
                        <option>Push In (천천히 전진)</option>
                        <option>Pan Right (우측 패닝)</option>
                        <option>Orbit (회전)</option>
                        <option>Handheld (자연스러운 흔들림)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1 mr-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/70">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={scene.duration}
                          onChange={(e) => updateScene(scene.id, 'duration', Number(e.target.value))}
                          className="w-10 text-xs font-bold text-center bg-transparent border-none focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 font-semibold">초</span>
                      </div>

                      <button onClick={() => moveScene(idx, 'up')} disabled={idx === 0} className="p-1.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 transition cursor-pointer">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveScene(idx, 'down')} disabled={idx === scenes.length - 1} className="p-1.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 transition cursor-pointer">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeScene(scene.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition cursor-pointer ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center group select-none shadow-xs">
                      {scene.image ? (
                        <img src={scene.image} alt={`Scene ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-3 text-slate-500 space-y-1">
                          <Video className="w-6 h-6 mx-auto opacity-40 text-violet-400" />
                          <p className="text-[10px] font-semibold">16:9 프레임</p>
                          <span className="text-[9px] text-slate-600 block">이미지 등록 가능</span>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center cursor-pointer text-white text-[11px] font-bold gap-1">
                        <Upload className="w-4 h-4 text-violet-300" />
                        <span>{scene.image ? '이미지 변경' : '레퍼런스 올리기'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleSceneImageUpload(scene.id, e)} className="hidden" />
                      </label>
                    </div>

                    <div className="md:col-span-2 space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-violet-600" /> 시각 프롬프트 (Visual Prompt)
                        </label>
                        <textarea
                          rows={2}
                          value={scene.prompt}
                          onChange={(e) => updateScene(scene.id, 'prompt', e.target.value)}
                          placeholder="영상 AI에 들어갈 시각적 묘사..."
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500 resize-none bg-slate-50/50"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                            <Music className="w-3 h-3 text-teal-600" /> 오디오 톤 (BGM)
                          </label>
                          <input
                            type="text"
                            value={scene.tone}
                            onChange={(e) => updateScene(scene.id, 'tone', e.target.value)}
                            placeholder="음악 무드"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                            <Mic className="w-3 h-3 text-indigo-600" /> 대사 / 내레이션
                          </label>
                          <input
                            type="text"
                            value={scene.narration}
                            onChange={(e) => updateScene(scene.id, 'narration', e.target.value)}
                            placeholder="내레이션 문장"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. AI 음악 프롬프트 & 사운드 랩 */}
        {activeTab === 'music' && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl"><Music className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">06. AI 음악 프롬프트 & 사운드 랩</h2>
                  <p className="text-xs text-slate-500">Suno / Udio 프롬프트 생성기, 사운드 프리셋 및 가사 메타태그 구조화</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">Audio Prompting</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Disc3 className="w-3.5 h-3.5 text-teal-500" /> 사운드 프리셋:
              </span>
              <button
                type="button"
                onClick={() => applyMusicPreset('cyberpunk')}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                ⚡ 사이버펑크 비트
              </button>
              <button
                type="button"
                onClick={() => applyMusicPreset('lofi')}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                ☕ 빗소리 코딩 로파이
              </button>
              <button
                type="button"
                onClick={() => applyMusicPreset('kpop')}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                ✨ K-Pop 댄스
              </button>
              <button
                type="button"
                onClick={() => applyMusicPreset('epic')}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                🎻 에픽 오케스트라
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-teal-600" /> 메인 장르 (Genre)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {genreOptions.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setMusicGenre(g)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        musicGenre === g
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 분위기 및 무드 (Mood)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {moodOptions.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMood(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        musicMoods.includes(m)
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      #{m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-indigo-500" /> 주요 악기 (Instruments)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {instrumentOptions.map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => toggleInstrument(inst)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        musicInstruments.includes(inst)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">템포 (BPM): <span className="text-teal-600 font-mono text-sm">{musicBpm}</span></span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {musicBpm < 90 ? '다운템포' : musicBpm <= 125 ? '미디엄' : '업템포'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={165}
                    value={musicBpm}
                    onChange={(e) => setMusicBpm(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">보컬 트랙 스타일</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'instrumental', label: '연주곡' },
                      { id: 'female', label: '여성 보컬' },
                      { id: 'male', label: '남성 보컬' },
                      { id: 'duet', label: '듀엣' },
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVocalType(v.id as any)}
                        className={`p-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer text-center ${
                          vocalType === v.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">가사 구조 메타태그 ([Verse], [Chorus]) 포함하기</span>
                  <span className="text-[11px] text-slate-400">Suno Custom 모드용 기승전결 트랙 생성</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeLyricsMeta}
                  onChange={(e) => setIncludeLyricsMeta(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
              </div>

              <div className="p-5 bg-slate-900 text-white rounded-3xl space-y-3 shadow-xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-teal-400 uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    AI Music Prompt Output
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Suno & Udio Ready</span>
                </div>

                <pre className="text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                  {getCombinedMusicPrompt()}
                </pre>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={copyMusicPrompt}
                    className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {copiedMusic ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMusic ? '프롬프트 복사 완료!' : '생성 프롬프트 원클릭 복사'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. 아이디어 스파크 아카이브 (고도화 핀보드) */}
        {activeTab === 'idea' && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-50 text-amber-600 rounded-xl"><Lightbulb className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">07. 크리에이티브 아이디어 스파크</h2>
                  <p className="text-xs text-slate-500">영감 및 기획 아카이빙 핀보드 (상태 관리, 검색, 마크다운 내보내기)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleExportIdeas}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                {copiedExport ? '마크다운 복사됨!' : '전체 아이디어 내보내기'}
              </button>
            </div>

            {/* 신규 아이디어 등록 폼 */}
            <form onSubmit={handleAddIdea} className="p-4 sm:p-5 bg-slate-50 rounded-3xl border border-slate-200/90 space-y-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 새로운 기획 / 영감 핀 추가
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700"
                >
                  <option>프로덕트</option>
                  <option>영상 기획</option>
                  <option>음악/사운드</option>
                  <option>디자인/UI</option>
                </select>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="아이디어 핵심 제목 (예: 생각 vs 실행 점수 기반 나만의 AI 코치)"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <textarea
                rows={2}
                value={newMemo}
                onChange={(e) => setNewMemo(e.target.value)}
                placeholder="구체적인 발상, 구현할 핵심 기술 스택, 레퍼런스 메모..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> 아이디어 핀 고정
                </button>
              </div>
            </form>

            {/* 필터 칩 & 검색창 바 */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* 카테고리 필터 */}
                <div className="flex flex-wrap gap-1.5">
                  {['전체', '프로덕트', '영상 기획', '음악/사운드', '디자인/UI'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        filterCategory === cat
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 검색 인풋 */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="아이디어 검색..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* 통계 요약 카운터 */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>총 <strong className="text-slate-700 font-bold">{filteredIdeas.length}</strong>개 아이디어 표시 중</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 별표를 누르면 최상단에 고정됩니다
                </span>
              </div>
            </div>

            {/* 아이디어 그리드 카드 뷰 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredIdeas.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition space-y-3 relative group flex flex-col justify-between ${
                    item.isPinned 
                      ? 'bg-amber-50/40 border-amber-300/80 shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-2">
                    {/* 카드 상단: 카테고리 태그, 생성일, 핀/삭제 버튼 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border ${
                          item.category === '프로덕트' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          item.category === '영상 기획' ? 'bg-violet-50 text-violet-700 border-violet-200' :
                          item.category === '음악/사운드' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePin(item.id)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            item.isPinned ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-amber-400'
                          }`}
                          title="상단 고정"
                        >
                          <Star className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-amber-500' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveIdea(item.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 제목 및 메모 본문 */}
                    <h4 className="text-sm font-bold text-slate-900 leading-snug tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-light leading-relaxed whitespace-pre-wrap">
                      {item.memo || '(추가 메모가 없습니다)'}
                    </p>
                  </div>

                  {/* 카드 하단: 상태 토글러 */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">실행 상태:</span>
                    <div className="flex gap-1">
                      {(['구상 중', '진행 중', '완료'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleChangeStatus(item.id, st)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                            item.status === st
                              ? st === '완료' ? 'bg-emerald-600 text-white' :
                                st === '진행 중' ? 'bg-indigo-600 text-white' :
                                'bg-slate-700 text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {filteredIdeas.length === 0 && (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-1">
                  <Lightbulb className="w-6 h-6 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">일치하는 아이디어가 없습니다</p>
                  <p className="text-[11px] text-slate-400">새로운 아이디어를 핀보드에 등록해 보세요.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 8. 초집중 스프린트 & 액션 다이스 */}
        {activeTab === 'focus' && <FocusActionSprint />}

      </div>
    </main>
  );
}