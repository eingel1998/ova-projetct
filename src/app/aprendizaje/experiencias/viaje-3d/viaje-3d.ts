import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Three.js imports
import * as THREE from 'three';

// Interface para hotspots con contenido educativo
interface HotspotInfo {
  id: string;
  position: THREE.Vector3;
  titulo: string;
  descripcion: string;
  contenido: string;
  color: number;
}

@Component({
  selector: 'app-viaje-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viaje-3d.html',
  styleUrls: ['./viaje-3d.css']
})
export class Viaje3D implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) container!: ElementRef<HTMLDivElement>;
  @Input() completada = false;
  @Output() onCompletar = new EventEmitter<void>();
  @Output() onVolver = new EventEmitter<void>();

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  // controls declared as any because OrbitControls is dynamically imported
  private controls: any;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private animationId = 0;
  private hotspots: THREE.Mesh[] = [];
  private humanModel!: THREE.Group;
  
  // Nuevas propiedades para efectos
  private particles: THREE.Points[] = [];
  private clock = new THREE.Clock();
  private hoveredMesh: THREE.Mesh | null = null;
  tourActive = false;
  private tourIndex = 0;
  private tourTimer: any = null;
  private bodyParts: THREE.Mesh[] = [];
  
  // Panel de información
  selectedHotspot: HotspotInfo | null = null;
  showPanel = false;

  // Definición de hotspots con contenido educativo
  hotspotsData: HotspotInfo[] = [
    {
      id: 'cabeza',
      position: new THREE.Vector3(0, 1.58, 0.16),
      titulo: 'Zona Orofaríngea',
      descripcion: 'El VPH puede infectar la boca y garganta a través del contacto directo.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">Infección en Zona Orofaríngea</h4>
        <p class="mb-3">El VPH puede transmitirse a la boca y garganta principalmente a través de:</p>
        <ul class="list-disc ml-5 mb-3">
          <li>Contacto oral-genital</li>
          <li>Besos profundos (menos común)</li>
          <li>Contacto con lesiones infectadas</li>
        </ul>
        <p class="mb-2"><strong>Síntomas:</strong></p>
        <p class="mb-3">Generalmente asintomático, pero puede causar:</p>
        <ul class="list-disc ml-5">
          <li>Lesiones o verrugas en boca</li>
          <li>Cambios en la voz</li>
          <li>Dificultad para tragar (casos avanzados)</li>
        </ul>
      `,
      color: 0xff6b9d
    },
    {
      id: 'cuello',
      position: new THREE.Vector3(0.08, 1.48, 0.1),
      titulo: 'Sistema Inmunológico',
      descripcion: 'El sistema inmune es la principal defensa contra el VPH.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">Respuesta Inmunológica</h4>
        <p class="mb-3">El sistema inmunológico juega un papel crucial en combatir el VPH:</p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Linfocitos T:</strong> Atacan células infectadas</li>
          <li><strong>Anticuerpos:</strong> Neutralizan el virus</li>
          <li><strong>Células NK:</strong> Eliminan células anormales</li>
        </ul>
        <p class="mb-2"><strong>Factores que debilitan la respuesta:</strong></p>
        <ul class="list-disc ml-5">
          <li>Estrés crónico</li>
          <li>Tabaquismo</li>
          <li>Inmunodepresión</li>
          <li>Mala nutrición</li>
        </ul>
      `,
      color: 0x4ecdc4
    },
    {
      id: 'torso',
      position: new THREE.Vector3(0, 1.15, 0.13),
      titulo: 'Órganos Internos',
      descripcion: 'El VPH puede afectar diversos tejidos internos.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">Afectación de Órganos</h4>
        <p class="mb-3">Aunque el VPH afecta principalmente superficies mucosas, puede tener impacto en:</p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Hígado:</strong> Procesa medicamentos antivirales</li>
          <li><strong>Sistema linfático:</strong> Transporta células inmunes</li>
          <li><strong>Médula ósea:</strong> Produce células inmunitarias</li>
        </ul>
        <p class="text-sm italic">El virus no "viaja" por la sangre, pero el sistema inmune usa estos órganos para combatirlo.</p>
      `,
      color: 0xffd93d
    },
    {
      id: 'area-genital',
      position: new THREE.Vector3(0, 0.72, 0.13),
      titulo: 'Área Genital - Zona de Alto Riesgo',
      descripcion: 'Principal sitio de infección y transmisión del VPH.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">Infección Genital por VPH</h4>
        <p class="mb-3"><strong>Es la infección de transmisión sexual más común en el mundo.</strong></p>

        <p class="mb-2"><strong>Transmisión:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li>Contacto piel con piel durante relaciones sexuales</li>
          <li>No requiere penetración completa</li>
          <li>Los condones reducen el riesgo pero no lo eliminan</li>
        </ul>

        <p class="mb-2"><strong>Tipos de VPH:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Bajo riesgo (6, 11):</strong> Causan verrugas genitales</li>
          <li><strong>Alto riesgo (16, 18):</strong> Pueden causar cáncer cervical</li>
        </ul>

        <p class="mb-2"><strong>Prevención:</strong></p>
        <ul class="list-disc ml-5">
          <li>💉 Vacunación (9-26 años, ideal antes de inicio sexual)</li>
          <li>🛡️ Uso de preservativo</li>
          <li>🔬 Exámenes regulares (Papanicolaou)</li>
          <li>👥 Limitar número de parejas sexuales</li>
        </ul>
      `,
      color: 0xff4757
    },
    {
      id: 'brazo-izquierdo',
      position: new THREE.Vector3(-0.29, 1.2, 0.08),
      titulo: 'Transmisión por Contacto Piel a Piel',
      descripcion: 'El VPH puede transmitirse por contacto directo de piel en cualquier zona.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">Contacto Piel a Piel</h4>
        <p class="mb-3">El VPH puede transmitirse en cualquier zona del cuerpo con piel dañada o mucosas:</p>

        <p class="mb-2"><strong>Zonas comunes de transmisión:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Brazos y piernas:</strong> Heridas, rasguños o piel irritada</li>
          <li><strong>Manos:</strong> Contacto con lesiones infectadas</li>
          <li><strong>Área anal:</strong> Similar a transmisión genital</li>
          <li><strong>Boca y garganta:</strong> Besos profundos o contacto oral</li>
        </ul>

        <p class="mb-2"><strong>Factores de riesgo:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li>Piel con heridas abiertas</li>
          <li>Contacto prolongado con piel infectada</li>
          <li>Compartición de objetos personales</li>
          <li>Prácticas sexuales sin protección</li>
        </ul>

        <p class="text-sm italic">💡 El virus puede sobrevivir en la piel seca hasta varias horas</p>
      `,
      color: 0x9b59b6
    },
    {
      id: 'pierna-derecha',
      position: new THREE.Vector3(0.18, 0.25, 0.12),
      titulo: 'Sistema Linfático y Propagación',
      descripcion: 'El sistema linfático transporta células inmunes y puede propagar el virus.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">Sistema Linfático</h4>
        <p class="mb-3">El sistema linfático juega un rol dual en la infección por VPH:</p>

        <p class="mb-2"><strong>Función defensiva:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li>Transporta linfocitos T y B al sitio de infección</li>
          <li>Produce anticuerpos específicos contra el VPH</li>
          <li>Elimina células infectadas anormales</li>
          <li>Coordina la respuesta inmune local</li>
        </ul>

        <p class="mb-2"><strong>Posible propagación:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li>El virus puede viajar por vasos linfáticos</li>
          <li>Inflamación ganglionar en infecciones activas</li>
          <li>Los ganglios pueden hincharse como respuesta inmune</li>
        </ul>

        <p class="mb-2"><strong>Signos de activación inmune:</strong></p>
        <ul class="list-disc ml-5">
          <li>Ganglios inguinales inflamados</li>
          <li>Hinchazón en cuello o axilas</li>
          <li>Sensibilidad en áreas afectadas</li>
        </ul>
      `,
      color: 0x3498db
    },
    {
      id: 'hombro-derecho',
      position: new THREE.Vector3(0.28, 1.38, 0.08),
      titulo: 'Vacunas contra el VPH',
      descripcion: 'La vacunación es la mejor protección contra el VPH.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">💉 Vacunas Disponibles</h4>
        <p class="mb-3"><strong>La vacunación es la forma más efectiva de prevenir el VPH.</strong></p>

        <p class="mb-2"><strong>Tipos de vacunas:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Cervarix:</strong> Protege contra tipos 16 y 18 (alto riesgo)</li>
          <li><strong>Gardasil:</strong> Protege contra 4 tipos (6, 11, 16, 18)</li>
          <li><strong>Gardasil 9:</strong> Protege contra 9 tipos (incluye 31, 33, 45, 52, 58)</li>
        </ul>

        <p class="mb-2"><strong>Esquema de vacunación:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Niñas y niños:</strong> 9-14 años (2 dosis)</li>
          <li><strong>Adolescentes:</strong> 15-26 años (3 dosis)</li>
          <li><strong>Adultos:</strong> Hasta 45 años (consultar médico)</li>
        </ul>

        <p class="mb-2"><strong>Efectividad:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li>Reduce riesgo de cáncer cervical en 70-90%</li>
          <li>Protege contra verrugas genitales</li>
          <li>Efectiva incluso si ya hay actividad sexual</li>
          <li>La vacuna no trata infecciones existentes</li>
        </ul>

        <p class="text-sm italic">🎯 <strong>Recomendación:</strong> Vacúnate antes del inicio de la actividad sexual para máxima protección</p>
      `,
      color: 0x2ecc71
    },
    {
      id: 'mano-izquierda',
      position: new THREE.Vector3(-0.25, 0.95, 0.15),
      titulo: 'Síntomas y Detección Temprana',
      descripcion: 'La mayoría de infecciones son asintomáticas, por eso los exámenes son cruciales.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">🔍 Detección y Síntomas</h4>
        <p class="mb-3"><strong>El 90% de las infecciones por VPH son asintomáticas.</strong></p>

        <p class="mb-2"><strong>Síntomas visibles:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Verrugas genitales:</strong> Bultos carnosos, únicos o múltiples</li>
          <li><strong>Lesiones en boca:</strong> Manchas blancas o rojas</li>
          <li><strong>Cambios en piel:</strong> Áreas rugosas o con bultos</li>
          <li><strong>Sangrado anormal:</strong> En relaciones sexuales</li>
        </ul>

        <p class="mb-2"><strong>Exámenes de detección:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Papanicolaou:</strong> Detecta cambios celulares (mujeres)</li>
          <li><strong>HPV Test:</strong> Detecta presencia del virus</li>
          <li><strong>Colposcopia:</strong> Examen visual detallado</li>
          <li><strong>Biopsia:</strong> Si se detectan anomalías</li>
        </ul>

        <p class="mb-2"><strong>Frecuencia recomendada:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li>Mujeres 21-29 años: Papanicolaou cada 3 años</li>
          <li>Mujeres 30-65 años: Papanicolaou + HPV cada 5 años</li>
          <li>Hombres: Sin screening rutinario específico</li>
        </ul>

        <p class="text-sm italic">⚠️ <strong>Importante:</strong> Los síntomas tardan meses o años en aparecer</p>
      `,
      color: 0xe74c3c
    },
    {
      id: 'rodilla-izquierda',
      position: new THREE.Vector3(-0.15, 0.3, 0.18),
      titulo: 'Tratamientos y Manejo',
      descripcion: 'La mayoría de infecciones se resuelven solas, pero el seguimiento médico es esencial.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">🩺 Tratamientos Disponibles</h4>
        <p class="mb-3">No existe cura para el VPH, pero hay tratamientos efectivos:</p>

        <p class="mb-2"><strong>Para verrugas genitales:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Cremas:</strong> Imiquimod, podofilina (aplicación local)</li>
          <li><strong>Cirugía:</strong> Crioterapia, electrocauterio, láser</li>
          <li><strong>Medicamentos:</strong> Ácido tricloroacético</li>
        </ul>

        <p class="mb-2"><strong>Para lesiones precancerosas:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Cirugía:</strong> Excisión o destrucción de tejido anormal</li>
          <li><strong>Termoterapia:</strong> Calor para destruir células</li>
          <li><strong>Seguimiento:</strong> Monitoreo regular de cambios</li>
        </ul>

        <p class="mb-2"><strong>Para cáncer cervical:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li><strong>Conización:</strong> Extirpación del tejido afectado</li>
          <li><strong>Histerectomía:</strong> En casos avanzados</li>
          <li><strong>Radioterapia/Quimioterapia:</strong> Para estadios avanzados</li>
        </ul>

        <p class="mb-2"><strong>Manejo natural:</strong></p>
        <ul class="list-disc ml-5 mb-3">
          <li>La mayoría de infecciones (70-90%) se resuelven en 1-2 años</li>
          <li>Sistema inmune fuerte acelera la resolución</li>
          <li>No hay tratamientos que "maten" el virus</li>
        </ul>

        <p class="text-sm italic">💡 <strong>Prevención es mejor que cura:</strong> La vacuna y exámenes regulares son la mejor estrategia</p>
      `,
      color: 0xf39c12
    },
    {
      id: 'pie-derecho',
      position: new THREE.Vector3(0.15, -0.08, 0.25),
      titulo: 'Mitos y Realidades del VPH',
      descripcion: 'Separando hechos de mitos comunes sobre el VPH.',
      contenido: `
        <h4 class="font-bold text-lg mb-2">❌ Mitos Comunes</h4>
        <p class="mb-3">Hay mucha desinformación sobre el VPH. Vamos a aclarar:</p>

        <p class="mb-2"><strong>MITO:</strong> "Solo afecta a mujeres"</p>
        <p class="mb-2"><strong>REALIDAD:</strong> Afecta a hombres y mujeres. Causa cáncer de pene, ano y orofaríngeo en hombres.</p>

        <p class="mb-2"><strong>MITO:</strong> "Los condones protegen completamente"</p>
        <p class="mb-2"><strong>REALIDAD:</strong> Reducen el riesgo significativamente, pero no lo eliminan por completo.</p>

        <p class="mb-2"><strong>MITO:</strong> "Si no hay síntomas, no hay infección"</p>
        <p class="mb-2"><strong>REALIDAD:</strong> El 90% de infecciones son asintomáticas. Solo se detectan con exámenes.</p>

        <p class="mb-2"><strong>MITO:</strong> "La vacuna causa infertilidad"</p>
        <p class="mb-2"><strong>REALIDAD:</strong> No hay evidencia científica. Es segura y no afecta la fertilidad.</p>

        <p class="mb-2"><strong>MITO:</strong> "Solo se transmite por sexo vaginal"</p>
        <p class="mb-2"><strong>REALIDAD:</strong> Se transmite por cualquier contacto piel a piel en zonas genitales.</p>

        <p class="mb-2"><strong>MITO:</strong> "Una vez infectado, siempre lo estarás"</p>
        <p class="mb-2"><strong>REALIDAD:</strong> La mayoría de infecciones se resuelven espontáneamente en 1-2 años.</p>

        <p class="mb-2"><strong>MITO:</strong> "Las verrugas son lo peor que puede pasar"</p>
        <p class="mb-2"><strong>REALIDAD:</strong> Los tipos de alto riesgo pueden causar varios tipos de cáncer.</p>

        <p class="text-sm italic">🔬 <strong>Basado en evidencia científica:</strong> Toda la información aquí está respaldada por estudios médicos y organizaciones como la OMS y CDC.</p>
      `,
      color: 0x8e44ad
    }
  ];

  async ngAfterViewInit(): Promise<void> {
    await this.initScene();
    await this.loadModel();
    this.addHotspotsSample();
    this.createParticleSystem();
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.animate();
    // pointer events
    this.container.nativeElement.addEventListener('pointerdown', this.onPointerDown);
    this.container.nativeElement.addEventListener('pointermove', this.onPointerMove);
  }

  private async initScene() {
    const width = this.container.nativeElement.clientWidth;
    const height = Math.max(400, Math.floor(window.innerHeight * 0.6));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf3f7ff);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.6, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.nativeElement.innerHTML = '';
    this.container.nativeElement.appendChild(this.renderer.domElement);

  // load OrbitControls dynamically (use explicit .js extension so bundlers can resolve)
  try {
    const orbitModule = await import('three/examples/jsm/controls/OrbitControls.js');
    const OrbitControlsDyn = orbitModule.OrbitControls;
    this.controls = new OrbitControlsDyn(this.camera, this.renderer.domElement);
  } catch (err) {
    // If dynamic import fails at build-time or run-time, fail gracefully and log.
    // Keeping controls undefined will disable orbit controls but app remains functional.
    // This also satisfies bundlers that require explicit file extensions.
    // eslint-disable-next-line no-console
    console.warn('Could not load OrbitControls dynamically:', err);
    this.controls = null as any;
  }
    this.controls.target.set(0, 1.2, 0);
    this.controls.update();

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemi.position.set(0, 20, 0);
    this.scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 10, 7.5);
    this.scene.add(dir);
  }

  private async loadModel() {
    // Crear modelo humano procedural mejorado con anatomía básica
    this.humanModel = this.createProceduralHuman();
    this.scene.add(this.humanModel);
  }

  private createProceduralHuman(): THREE.Group {
    const human = new THREE.Group();
    
    // Materiales con diferentes tonos de piel
    const skinMat = new THREE.MeshStandardMaterial({ 
      color: 0xffdbac, 
      roughness: 0.8,
      metalness: 0.1 
    });
    const darkSkinMat = new THREE.MeshStandardMaterial({ 
      color: 0xd4a574, 
      roughness: 0.8 
    });

    // Cabeza - más realista
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 32, 32),
      skinMat
    );
    head.position.set(0, 1.65, 0);
    head.scale.set(1, 1.2, 1);
    human.add(head);
    this.bodyParts.push(head);

    // Cuello - más definido
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.07, 0.12, 16),
      skinMat
    );
    neck.position.set(0, 1.52, 0);
    human.add(neck);
    this.bodyParts.push(neck);

    // Torso superior - más anatómico
    const torsoUpper = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.35, 0.22),
      new THREE.MeshStandardMaterial({ 
        color: 0x5a8bc4,
        roughness: 0.7 
      })
    );
    torsoUpper.position.set(0, 1.28, 0);
    torsoUpper.userData['isTorso'] = true;
    human.add(torsoUpper);
    this.bodyParts.push(torsoUpper);

    // Torso inferior
    const torsoLower = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.25, 0.20),
      new THREE.MeshStandardMaterial({ 
        color: 0x6c95ce,
        roughness: 0.7 
      })
    );
    torsoLower.position.set(0, 0.98, 0);
    torsoLower.userData['isTorso'] = true;
    human.add(torsoLower);
    this.bodyParts.push(torsoLower);

    // Hombros (pivotes) y brazos jerárquicos para pose natural
    const shoulderGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderGeo, skinMat);
    leftShoulder.position.set(-0.22, 1.38, 0.04);
    human.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, skinMat);
    rightShoulder.position.set(0.22, 1.38, 0.04);
    human.add(rightShoulder);

    // Crear grupos para brazos para que roten desde el hombro
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.copy(leftShoulder.position);
    human.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.copy(rightShoulder.position);
    human.add(rightArmGroup);

    // Geometrías armadas con pivote en el hombro
    const upperArmLength = 0.24;
    const forearmLength = 0.22;
    const upperArmGeo = new THREE.CapsuleGeometry(0.04, upperArmLength, 8, 16);
    const forearmGeo = new THREE.CapsuleGeometry(0.035, forearmLength, 8, 16);
    const handGeo = new THREE.SphereGeometry(0.035, 12, 12);

    // Brazo izquierdo: cuelga naturalmente con leve ángulo
    const leftUpperArm = new THREE.Mesh(upperArmGeo, skinMat);
    leftUpperArm.position.set(0, -upperArmLength / 2, 0);
    leftUpperArm.rotation.z = 0.15;  // pequeña rotación hacia afuera
    leftUpperArm.rotation.x = -0.1;  // pequeña rotación hacia adelante
    leftArmGroup.add(leftUpperArm);

    const leftForearmGroup = new THREE.Group();
    leftForearmGroup.position.set(0, -upperArmLength, 0);
    leftArmGroup.add(leftForearmGroup);

    const leftForearm = new THREE.Mesh(forearmGeo, skinMat);
    leftForearm.position.set(0, -forearmLength / 2, 0);
    leftForearm.rotation.z = -0.05;  // muy leve doblez del codo
    leftForearmGroup.add(leftForearm);

    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.scale.set(1.1, 1.3, 0.8);
    leftHand.position.set(0, -forearmLength, 0.01);
    leftForearmGroup.add(leftHand);

    // Brazo derecho (simétrico)
    const rightUpperArm = new THREE.Mesh(upperArmGeo, skinMat);
    rightUpperArm.position.set(0, -upperArmLength / 2, 0);
    rightUpperArm.rotation.z = -0.15;
    rightUpperArm.rotation.x = -0.1;
    rightArmGroup.add(rightUpperArm);

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.set(0, -upperArmLength, 0);
    rightArmGroup.add(rightForearmGroup);

    const rightForearm = new THREE.Mesh(forearmGeo, skinMat);
    rightForearm.position.set(0, -forearmLength / 2, 0);
    rightForearm.rotation.z = 0.05;
    rightForearmGroup.add(rightForearm);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.scale.set(1.1, 1.3, 0.8);
    rightHand.position.set(0, -forearmLength, 0.01);
    rightForearmGroup.add(rightHand);        // Pelvis - más anatómica
    const pelvis = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.18, 0.22),
      darkSkinMat
    );
    pelvis.position.set(0, 0.8, 0);
    human.add(pelvis);

    // Muslos
    const thighGeo = new THREE.CapsuleGeometry(0.065, 0.38, 12, 16);
    
    const leftThigh = new THREE.Mesh(thighGeo, darkSkinMat);
    leftThigh.position.set(-0.11, 0.52, 0);
    human.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, darkSkinMat);
    rightThigh.position.set(0.11, 0.52, 0);
    human.add(rightThigh);

    // Rodillas
    const kneeGeo = new THREE.SphereGeometry(0.055, 12, 12);
    
    const leftKnee = new THREE.Mesh(kneeGeo, darkSkinMat);
    leftKnee.position.set(-0.11, 0.3, 0.02);
    human.add(leftKnee);

    const rightKnee = new THREE.Mesh(kneeGeo, darkSkinMat);
    rightKnee.position.set(0.11, 0.3, 0.02);
    human.add(rightKnee);

    // Pantorrillas
    const shinGeo = new THREE.CapsuleGeometry(0.055, 0.36, 12, 16);
    
    const leftShin = new THREE.Mesh(shinGeo, darkSkinMat);
    leftShin.position.set(-0.11, 0.1, 0);
    human.add(leftShin);

    const rightShin = new THREE.Mesh(shinGeo, darkSkinMat);
    rightShin.position.set(0.11, 0.1, 0);
    human.add(rightShin);

    // Pies
    const footGeo = new THREE.BoxGeometry(0.08, 0.05, 0.12);
    
    const leftFoot = new THREE.Mesh(footGeo, darkSkinMat);
    leftFoot.position.set(-0.11, -0.1, 0.03);
    human.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeo, darkSkinMat);
    rightFoot.position.set(0.11, -0.1, 0.03);
    human.add(rightFoot);

    // Añadir líneas de contorno al torso superior para mejor visualización
    const edges = new THREE.EdgesGeometry(torsoUpper.geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true })
    );
    torsoUpper.add(line);

    return human;
  }

  private addHotspotsSample() {
    // Crear hotspots basados en la data educativa
    const sphereGeo = new THREE.SphereGeometry(0.04, 16, 16);

    this.hotspotsData.forEach((hotspotData, index) => {
      const mat = new THREE.MeshStandardMaterial({ 
        color: hotspotData.color,
        emissive: hotspotData.color,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.9
      });

      const sphere = new THREE.Mesh(sphereGeo, mat);
      sphere.position.copy(hotspotData.position);
      sphere.userData = { hotspotIndex: index };
      
      this.scene.add(sphere);
      this.hotspots.push(sphere);

      // Añadir pulso animado
      const pulseRing = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.06, 32),
        new THREE.MeshBasicMaterial({ 
          color: hotspotData.color,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide
        })
      );
      pulseRing.position.copy(hotspotData.position);
      pulseRing.lookAt(this.camera.position);
      pulseRing.userData = { isPulse: true, baseScale: 1 };
      this.scene.add(pulseRing);
    });
  }

  /**
   * Sistema de partículas para simular virus VPH
   */
  private createParticleSystem() {
    // Ruta 1: Transmisión oral (boca → garganta → cuello)
    this.createParticleRoute(
      { x: 0, y: 1.7, z: 0.2 },    // Punto inicial: cerca de la boca
      { x: 0, y: 1.5, z: 0.1 },    // Punto final: garganta/cuello
      25,                           // 25 partículas
      0xff6b9d,                    // Color rosa (zona cabeza/cuello)
      'oral'
    );

    // Ruta 2: Transmisión genital (área externa → mucosas internas)
    this.createParticleRoute(
      { x: 0.15, y: 0.8, z: 0.25 },  // Punto inicial: área genital externa
      { x: 0, y: 0.7, z: 0.05 },     // Punto final: área interna
      25,                             // 25 partículas
      0xff4757,                      // Color rojo (zona genital)
      'genital'
    );

    // Ruta 3: Circulación en zona de torso (posible contagio de piel a piel)
    this.createParticleRoute(
      { x: -0.2, y: 1.2, z: 0.3 },   // Punto inicial: lado torso
      { x: 0.2, y: 1.1, z: 0.3 },    // Punto final: otro lado torso
      15,                             // 15 partículas
      0xffd93d,                      // Color amarillo (torso)
      'skin'
    );

    // Ruta 5: Sistema linfático (pierna → torso → cuello)
    this.createParticleRoute(
      { x: 0.18, y: 0.25, z: 0.12 },  // Punto inicial: pierna (sistema linfático)
      { x: 0.08, y: 1.48, z: 0.1 },    // Punto final: cuello (ganglios linfáticos)
      20,                               // 20 partículas
      0x3498db,                        // Color azul (sistema linfático)
      'linfatico'
    );
  }

  // Crear ruta dirigida de partículas
  private createParticleRoute(start: any, end: any, count: number, color: number, routeType: string) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const progress = new Float32Array(count); // Progreso en la ruta (0-1)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = i / count; // Distribución inicial a lo largo de la ruta
      
      // Posición inicial interpolada entre start y end
      positions[i3] = start.x + (end.x - start.x) * t;
      positions[i3 + 1] = start.y + (end.y - start.y) * t;
      positions[i3 + 2] = start.z + (end.z - start.z) * t;

      // Velocidad dirigida hacia el punto final
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dz = end.z - start.z;
      const length = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      velocities[i3] = (dx / length) * 0.002;
      velocities[i3 + 1] = (dy / length) * 0.002;
      velocities[i3 + 2] = (dz / length) * 0.002;

      progress[i] = t;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('progress', new THREE.BufferAttribute(progress, 1));

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.03,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = { routeType, start, end };
    this.scene.add(particles);
    this.particles.push(particles);
  }

  // Crear enjambre de partículas orbitando un punto (simulando ataque/infección)
  private createParticleSwarm(center: any, count: number, radius: number, color: number) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const angles = new Float32Array(count); // Ángulo de órbita

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2;
      const r = radius * (0.5 + Math.random() * 0.5);
      
      positions[i3] = center.x + Math.cos(angle) * r;
      positions[i3 + 1] = center.y + (Math.random() - 0.5) * radius * 0.3;
      positions[i3 + 2] = center.z + Math.sin(angle) * r;

      angles[i] = angle;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('angle', new THREE.BufferAttribute(angles, 1));

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.025,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = { swarmCenter: center, swarmRadius: radius };
    this.scene.add(particles);
    this.particles.push(particles);
  }

  /**
   * Animar partículas con rutas específicas
   */
  private animateParticles() {
    const time = this.clock.getElapsedTime();

    this.particles.forEach(particleSystem => {
      const positions = particleSystem.geometry.attributes['position'];
      const velocities = particleSystem.geometry.attributes['velocity'];
      const userData = particleSystem.userData;

      // Si es una ruta dirigida
      if (userData['routeType']) {
        const progress = particleSystem.geometry.attributes['progress'];
        const start = userData['start'];
        const end = userData['end'];

        for (let i = 0; i < positions.count; i++) {
          const i3 = i * 3;
          
          // Avanzar en la ruta
          positions.array[i3] += velocities.array[i3];
          positions.array[i3 + 1] += velocities.array[i3 + 1];
          positions.array[i3 + 2] += velocities.array[i3 + 2];

          // Actualizar progreso
          progress.array[i] += 0.003;

          // Si llegó al final, reiniciar desde el inicio
          if (progress.array[i] >= 1.0) {
            progress.array[i] = 0;
            positions.array[i3] = start.x + (Math.random() - 0.5) * 0.05;
            positions.array[i3 + 1] = start.y + (Math.random() - 0.5) * 0.05;
            positions.array[i3 + 2] = start.z + (Math.random() - 0.5) * 0.05;
          }

          // Pequeña ondulación lateral para simular movimiento orgánico
          const wave = Math.sin(time * 2 + i * 0.5) * 0.001;
          positions.array[i3] += wave;
          positions.array[i3 + 2] += wave * 0.7;
        }

        progress.needsUpdate = true;
      } 
      // Si es un enjambre orbital
      else if (userData['swarmCenter']) {
        const center = userData['swarmCenter'];
        const radius = userData['swarmRadius'];
        const angles = particleSystem.geometry.attributes['angle'];

        for (let i = 0; i < positions.count; i++) {
          const i3 = i * 3;
          
          // Órbita circular alrededor del punto
          angles.array[i] += 0.01;
          const angle = angles.array[i];
          const r = radius * (0.5 + Math.sin(time + i) * 0.2);
          
          positions.array[i3] = center.x + Math.cos(angle) * r;
          positions.array[i3 + 1] = center.y + Math.sin(time * 2 + i) * radius * 0.2;
          positions.array[i3 + 2] = center.z + Math.sin(angle) * r;
        }

        angles.needsUpdate = true;
      }

      positions.needsUpdate = true;
    });
  }

  /**
   * Animación de respiración
   */
  private animateBreathing() {
    const time = this.clock.getElapsedTime();
    const breathingSpeed = 1.5;
    const breathingAmount = 0.015;

    this.bodyParts.forEach(part => {
      if (part.userData['isTorso']) {
        const scale = 1 + Math.sin(time * breathingSpeed) * breathingAmount;
        part.scale.set(1, scale, 1);
      }
    });
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();

    // Animaciones
    this.animateParticles();
    this.animateBreathing();

    // Animar pulsos de hotspots
    this.scene.children.forEach(child => {
      if (child.userData['isPulse']) {
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.2;
        child.scale.set(scale, scale, 1);
        child.lookAt(this.camera.position);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  private onPointerMove = (event: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Detectar hover sobre partes del cuerpo
    const intersects = this.raycaster.intersectObjects(this.bodyParts, false);
    
    // Resetear hover anterior
    if (this.hoveredMesh && this.hoveredMesh.material) {
      const mat = this.hoveredMesh.material as THREE.MeshStandardMaterial;
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
    }

    if (intersects.length > 0) {
      this.hoveredMesh = intersects[0].object as THREE.Mesh;
      const mat = this.hoveredMesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissive.setHex(0x4ecdc4);
        mat.emissiveIntensity = 0.3;
      }
      this.renderer.domElement.style.cursor = 'pointer';
    } else {
      this.hoveredMesh = null;
      this.renderer.domElement.style.cursor = 'default';
    }
  }

  private onPointerDown = (event: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.hotspots, false);
    if (intersects.length > 0) {
      const clickedHotspot = intersects[0].object;
      const hotspotIndex = clickedHotspot.userData['hotspotIndex'];
      
      if (hotspotIndex !== undefined) {
        this.selectedHotspot = this.hotspotsData[hotspotIndex];
        this.showPanel = true;

        // Animar cámara hacia el hotspot
        this.focusOnHotspot(this.selectedHotspot.position);
      }
    }
  }

  private focusOnHotspot(position: THREE.Vector3 | {x: number, y: number, z: number}) {
    // Suave transición de cámara
    const pos = position instanceof THREE.Vector3 ? position : new THREE.Vector3(position.x, position.y, position.z);
    const offset = new THREE.Vector3(0.5, 0.3, 0.8);
    const targetPos = pos.clone().add(offset);
    
    // Animación suave con lerp
    const duration = 60; // frames
    let frame = 0;
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();

    const animateCamera = () => {
      frame++;
      const t = Math.min(frame / duration, 1);
      const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

      this.camera.position.lerpVectors(startPos, targetPos, easeT);
      this.controls.target.lerpVectors(startTarget, pos, easeT);
      this.controls.update();

      if (frame < duration) {
        requestAnimationFrame(animateCamera);
      }
    };
    animateCamera();
  }

  /**
   * Tour guiado automático
   */
  startTour() {
    if (this.tourActive) {
      this.stopTour();
      return;
    }

    this.tourActive = true;
    this.tourIndex = 0;
    this.nextTourStop();
  }

  private nextTourStop() {
    if (!this.tourActive || this.tourIndex >= this.hotspotsData.length) {
      this.stopTour();
      return;
    }

    const hotspot = this.hotspotsData[this.tourIndex];
    this.selectedHotspot = hotspot;
    this.showPanel = true;
    this.focusOnHotspot(hotspot.position);

    this.tourTimer = setTimeout(() => {
      this.tourIndex++;
      this.nextTourStop();
    }, 5000); // 5 segundos por hotspot
  }

  stopTour() {
    this.tourActive = false;
    if (this.tourTimer) {
      clearTimeout(this.tourTimer);
      this.tourTimer = null;
    }
  }

  getCurrentHotspotIndex(): number {
    if (!this.selectedHotspot) return 0;
    return this.hotspotsData.findIndex(h => h.id === this.selectedHotspot!.id);
  }

  selectHotspot(hotspot: HotspotInfo): void {
    this.selectedHotspot = hotspot;
    this.showPanel = true;
    this.focusOnHotspot(hotspot.position);
  }

  closePanel() {
    this.showPanel = false;
    this.selectedHotspot = null;
  }

  nextHotspot() {
    if (!this.selectedHotspot) return;
    const currentIndex = this.hotspotsData.findIndex(h => h.id === this.selectedHotspot!.id);
    const nextIndex = (currentIndex + 1) % this.hotspotsData.length;
    this.selectedHotspot = this.hotspotsData[nextIndex];
    this.focusOnHotspot(this.selectedHotspot.position);
  }

  prevHotspot() {
    if (!this.selectedHotspot) return;
    const currentIndex = this.hotspotsData.findIndex(h => h.id === this.selectedHotspot!.id);
    const prevIndex = (currentIndex - 1 + this.hotspotsData.length) % this.hotspotsData.length;
    this.selectedHotspot = this.hotspotsData[prevIndex];
    this.focusOnHotspot(this.selectedHotspot.position);
  }

  marcarCompletada() {
    this.onCompletar.emit();
  }

  volver() {
    this.onVolver.emit();
  }

  private onWindowResize() {
    if (!this.container) return;
    const width = this.container.nativeElement.clientWidth;
    const height = Math.max(400, Math.floor(window.innerHeight * 0.6));
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.container.nativeElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.dispose();
  }
}
