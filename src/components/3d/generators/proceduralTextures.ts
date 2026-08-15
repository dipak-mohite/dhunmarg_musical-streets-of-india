import * as THREE from 'three';

// Procedural Canvas Texture Generator for Indian Urban Props & Signboards
export class ProceduralTextureFactory {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  public static getTruckArtTexture(): THREE.CanvasTexture {
    if (this.cache.has('truck_art')) return this.cache.get('truck_art')!;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Yellow background base
    ctx.fillStyle = '#EAB308';
    ctx.fillRect(0, 0, 1024, 512);

    // Red and green floral border
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#DC2626';
    ctx.strokeRect(10, 10, 1004, 492);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#16A34A';
    ctx.strokeRect(26, 26, 972, 460);

    // Traditional triangle fringes
    for (let x = 30; x < 1000; x += 30) {
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.moveTo(x, 34);
      ctx.lineTo(x + 15, 54);
      ctx.lineTo(x + 30, 34);
      ctx.fill();

      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.moveTo(x, 478);
      ctx.lineTo(x + 15, 458);
      ctx.lineTo(x + 30, 478);
      ctx.fill();
    }

    // Centered "HORN OK PLEASE" in authentic 3D painted font
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // "HORN" (Left)
    ctx.font = 'bold 58px "Rozha One", serif';
    ctx.fillStyle = '#1E3A8A';
    ctx.fillText('HORN', 220, 256);
    ctx.fillStyle = '#DC2626';
    ctx.fillText('HORN', 216, 252);

    // "OK" (Center Badge)
    ctx.beginPath();
    ctx.arc(512, 256, 75, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.font = 'bold 64px "Outfit", sans-serif';
    ctx.fillStyle = '#FEF08A';
    ctx.fillText('OK', 512, 256);

    // "PLEASE" (Right)
    ctx.font = 'bold 58px "Rozha One", serif';
    ctx.fillStyle = '#1E3A8A';
    ctx.fillText('PLEASE', 800, 256);
    ctx.fillStyle = '#DC2626';
    ctx.fillText('PLEASE', 796, 252);

    // Top Shayari
    ctx.font = 'bold 32px "Tiro Devanagari Hindi", serif';
    ctx.fillStyle = '#991B1B';
    ctx.fillText('॥ बुरी नज़र वाले तेरा मुँह काला ॥', 512, 100);

    // Bottom Slogan
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.fillStyle = '#1E3A8A';
    ctx.fillText('★ USE DIPPER AT NIGHT ★ DEKHO MAGAR PYAAR SE ★', 512, 410);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    this.cache.set('truck_art', texture);
    return texture;
  }

  public static getBarberSignTexture(): THREE.CanvasTexture {
    if (this.cache.has('barber_sign')) return this.cache.get('barber_sign')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Rich gradient background
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(1, '#1E293B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Golden frame
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 496, 240);

    // Barber barber pole stripes on left & right
    const drawPole = (x: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 16, 32, 224);
      ctx.clip();
      for (let y = -50; y < 300; y += 30) {
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(x, y, 32, 15);
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(x, y + 15, 32, 15);
      }
      ctx.restore();
    };
    drawPole(16);
    drawPole(464);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FEF3C7';
    ctx.font = 'bold 36px "Tiro Devanagari Hindi", serif';
    ctx.fillText('न्यू भारत हेयर सैलून', 256, 75);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 30px "Outfit", sans-serif';
    ctx.fillText("NEW BHARAT MEN'S SALON", 256, 130);

    ctx.fillStyle = '#FCD34D';
    ctx.font = '20px "Outfit", sans-serif';
    ctx.fillText('★ A/C • HAIR CUT • CHAMPI • FACIAL ★', 256, 185);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('barber_sign', texture);
    return texture;
  }

  public static getTapriSignTexture(): THREE.CanvasTexture {
    if (this.cache.has('tapri_sign')) return this.cache.get('tapri_sign')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Weathered wooden texture background
    ctx.fillStyle = '#451A03';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 492, 236);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 38px "Tiro Devanagari Hindi", serif';
    ctx.fillText('शर्मा जी की चाय टपरी', 256, 70);

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.fillText('SPECIAL CUTTING CHAI & BUN MASKA', 256, 125);

    ctx.fillStyle = '#FEF08A';
    ctx.font = '22px "Outfit", sans-serif';
    ctx.fillText('♨ Kadak Adrak Elaichi Chai • Samosa • Bun Maska ♨', 256, 185);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('tapri_sign', texture);
    return texture;
  }

  public static getAutoDetailsTexture(): THREE.CanvasTexture {
    if (this.cache.has('auto_details')) return this.cache.get('auto_details')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#065F46'; // Green auto base
    ctx.fillRect(0, 0, 512, 256);

    // Yellow stripe
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(0, 80, 512, 90);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.fillText('MH 02 DA 2026', 256, 135);

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 26px "Tiro Devanagari Hindi", serif';
    ctx.fillText('॥ श्री गणेशाय नमः ॥', 256, 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Outfit", sans-serif';
    ctx.fillText('★ 24x7 FOR HIRE • CNG POWER ★', 256, 215);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('auto_details', texture);
    return texture;
  }

  public static getBusSignTexture(): THREE.CanvasTexture {
    if (this.cache.has('bus_sign')) return this.cache.get('bus_sign')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 120);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 30px "Tiro Devanagari Hindi", serif';
    ctx.fillText('404 दादर ⇄ पुणे सुपरफास्ट', 256, 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Outfit", sans-serif';
    ctx.fillText('STATE TRANSPORT • LAL DABBA EXP', 256, 95);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('bus_sign', texture);
    return texture;
  }

  public static getOfficeSignTexture(): THREE.CanvasTexture {
    if (this.cache.has('office_sign')) return this.cache.get('office_sign')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 240);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText('INDITECH TOWER', 256, 90);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '22px "Outfit", sans-serif';
    ctx.fillText('SOFTWARE RESEARCH & LABS', 256, 145);

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 18px "Outfit", sans-serif';
    ctx.fillText('INNOVATION • CODE • CHILL', 256, 195);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('office_sign', texture);
    return texture;
  }

  public static getBaraatSignTexture(): THREE.CanvasTexture {
    if (this.cache.has('baraat_sign')) return this.cache.get('baraat_sign')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#831843'; // Festive magenta
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 496, 240);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 38px "Tiro Devanagari Hindi", serif';
    ctx.fillText('॥ शुभ विवाह • डीजे रॉकी ॥', 256, 75);

    ctx.fillStyle = '#F472B6';
    ctx.font = 'bold 30px "Outfit", sans-serif';
    ctx.fillText('ROCKY BASS SOUND & DHOL', 256, 130);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Outfit", sans-serif';
    ctx.fillText('♫ BHANGRA • DHOLAK • DANCE FLOOR ♫', 256, 185);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('baraat_sign', texture);
    return texture;
  }

  public static getConcertSignTexture(): THREE.CanvasTexture {
    if (this.cache.has('concert_sign')) return this.cache.get('concert_sign')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#18181B';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 496, 240);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#F43F5E';
    ctx.font = '900 42px "Cinzel", serif';
    ctx.fillText('COKE STUDIO LIVE', 256, 80);

    ctx.fillStyle = '#C084FC';
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.fillText('SUFI FUSION FESTIVAL 2026', 256, 135);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 20px "Outfit", sans-serif';
    ctx.fillText('LIVE ACOUSTICS & ELECTRIC RAGAS', 256, 190);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('concert_sign', texture);
    return texture;
  }

  public static getMahfilCarpetTexture(): THREE.CanvasTexture {
    if (this.cache.has('mahfil_carpet')) return this.cache.get('mahfil_carpet')!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Deep crimson Persian rug base
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(0, 0, 512, 512);

    // Intricate gold ornate borders
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#D97706';
    ctx.strokeRect(20, 20, 472, 472);

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FDE68A';
    ctx.strokeRect(40, 40, 432, 432);

    // Center floral medallion
    ctx.beginPath();
    ctx.arc(256, 256, 90, 0, Math.PI * 2);
    ctx.fillStyle = '#991B1B';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FBBF24';
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = 256 + Math.cos(angle) * 55;
      const y = 256 + Math.sin(angle) * 55;
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set('mahfil_carpet', texture);
    return texture;
  }

  public static getMoviePosterTexture(index: number = 0): THREE.CanvasTexture {
    const key = `movie_poster_${index}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext('2d')!;

    const posters = [
      { title: 'DILWALE', sub: 'SHAH RUKH • KAJOL', bg: '#991B1B', color: '#FEF08A' },
      { title: 'SHOLAY', sub: 'GABBAR IS BACK', bg: '#78350F', color: '#F59E0B' },
      { title: 'GULLY BOY', sub: 'APNA TIME AAYEGA', bg: '#18181B', color: '#38BDF8' },
      { title: 'AMUL BUTTER', sub: 'UTTERLY BUTTERLY DELICIOUS', bg: '#1E3A8A', color: '#FEF08A' },
    ];

    const p = posters[index % posters.length];
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, 256, 384);

    ctx.strokeStyle = p.color;
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 240, 368);

    ctx.textAlign = 'center';
    ctx.fillStyle = p.color;
    ctx.font = '900 32px "Cinzel", serif';
    ctx.fillText(p.title, 128, 120);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText(p.sub, 128, 180);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '14px "Outfit", sans-serif';
    ctx.fillText('NOW PLAYING IN CINEMAS', 128, 300);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  public static getStreetSignTexture(nameHindi: string, nameEng: string): THREE.CanvasTexture {
    const key = `street_${nameEng}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#065F46'; // Classic green Indian road sign
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 500, 116);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px "Tiro Devanagari Hindi", serif';
    ctx.fillText(nameHindi, 256, 50);

    ctx.font = 'bold 24px "Outfit", sans-serif';
    ctx.fillText(nameEng, 256, 95);

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }
}
