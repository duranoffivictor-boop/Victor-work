import { DocumentState } from '../types/document';

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'General' | 'Negocios' | 'Profesional' | 'Académico';
  previewColor: string;
  defaultTitle: string;
  content: string;
  pageSize: 'letter' | 'a4';
  marginType: 'normal' | 'narrow' | 'moderate';
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'blank',
    name: 'Documento en blanco',
    description: 'Comienza desde cero con una hoja limpia y configuración estándar.',
    category: 'General',
    previewColor: 'from-blue-500 to-indigo-600',
    defaultTitle: 'Documento sin título',
    pageSize: 'letter',
    marginType: 'normal',
    content: `
      <h1>Título del documento</h1>
      <p>Comienza a escribir aquí tu texto o selecciona opciones de la cinta superior para dar formato a tus párrafos, insertar tablas o imágenes.</p>
    `,
  },
  {
    id: 'business_letter',
    name: 'Carta Formal de Negocios',
    description: 'Estructura elegante con membrete, remitente, destinatario y cuerpo protocolar.',
    category: 'Negocios',
    previewColor: 'from-slate-700 to-slate-900',
    defaultTitle: 'Carta Comercial Formal',
    pageSize: 'letter',
    marginType: 'normal',
    content: `
      <p style="text-align: right; color: #64748b;"><strong>Fecha:</strong> 10 de noviembre de 2026</p>
      <p>
        <strong>De:</strong> Lic. Alejandro Morales<br>
        <strong>Cargo:</strong> Director de Operaciones<br>
        <strong>Empresa:</strong> Soluciones Globales S.A.<br>
        <strong>Correo:</strong> contacto@solucionesglobales.com
      </p>
      <p>
        <strong>Para:</strong> Dra. Mariana Valenzuela<br>
        <strong>Cargo:</strong> Gerente General<br>
        <strong>Entidad:</strong> Corporación Alianza
      </p>
      <hr>
      <h2>Asunto: Propuesta de Colaboración Estratégica 2027</h2>
      <p>Estimada Dra. Valenzuela:</p>
      <p>Es un grato placer saludarla. Por medio de la presente, me dirijo a usted con el propósito de formalizar nuestro interés en establecer una alianza comercial y tecnológica entre nuestras respectivas organizaciones para el próximo ciclo operativo.</p>
      <p>Tras evaluar los resultados de las sesiones de trabajo preliminares celebradas el mes pasado, hemos consolidado un marco de trabajo que contempla los siguientes ejes fundamentales:</p>
      <ul>
        <li><strong>Optimización de procesos operativos:</strong> Reducción estimada del 25% en tiempos de respuesta.</li>
        <li><strong>Integración tecnológica segura:</strong> Implementación de protocolos estándar y auditoría continua.</li>
        <li><strong>Capacitación especializada:</strong> Programas de formación para los equipos de liderazgo y ejecución.</li>
      </ul>
      <p>Adjuntamos el cronograma preliminar y quedamos a su entera disposición para coordinar una reunión de cierre el próximo jueves.</p>
      <p>Agradeciendo de antemano su atención y consideración, se despide cordialmente,</p>
      <br>
      <p>
        <strong>Lic. Alejandro Morales</strong><br>
        Director de Operaciones | Soluciones Globales S.A.
      </p>
    `,
  },
  {
    id: 'modern_cv',
    name: 'Currículum Vitae Moderno',
    description: 'Perfil profesional limpio, experiencia laboral estructurada, habilidades y educación.',
    category: 'Profesional',
    previewColor: 'from-teal-600 to-cyan-700',
    defaultTitle: 'CV - Perfil Profesional',
    pageSize: 'a4',
    marginType: 'narrow',
    content: `
      <h1 style="color: #0f172a; margin-bottom: 4px;">SOFÍA HERNÁNDEZ BARRERA</h1>
      <p style="color: #0284c7; font-weight: 600; font-size: 1.1rem; margin-top: 0;">Líder de Proyectos de Software &amp; Transformación Digital</p>
      <p style="color: #475569; font-size: 0.9rem;">Madrid, España · (+34) 612 345 678 · sofia.hernandez@email.com · linkedin.com/in/sofia-hernandez</p>
      <hr>
      
      <h2>Resumen Profesional</h2>
      <p>Profesional con más de 8 años de experiencia liderando equipos multidisciplinarios en el diseño y despliegue de productos digitales a gran escala. Especializada en metodologías ágiles, arquitectura cloud y optimización de flujos de trabajo orientados a resultados.</p>
      
      <h2>Experiencia Laboral</h2>
      <p><strong>Directora de Producto e Innovación</strong> | TechNova Solutions (2022 - Presente)</p>
      <ul>
        <li>Lideré un equipo de 18 ingenieros y diseñadores para lanzar la plataforma SaaS insignia, incrementando los usuarios activos en un 140%.</li>
        <li>Diseñé estrategias de automatización que redujeron los costos de infraestructura en un 30% anual.</li>
      </ul>
      
      <p><strong>Senior Project Manager</strong> | Innovatech Group (2019 - 2022)</p>
      <ul>
        <li>Gestión integral de 12 proyectos estratégicos para clientes del sector financiero y salud con cumplimiento del 100% en plazos.</li>
        <li>Implementación del marco Scrum transversal mejorando la velocidad del equipo en un 35%.</li>
      </ul>
      
      <h2>Educación &amp; Certificaciones</h2>
      <ul>
        <li><strong>Máster en Dirección de Proyectos Tecnológicos</strong> — Universidad Politécnica (2018)</li>
        <li><strong>Grado en Ingeniería Informática</strong> — Universidad Complutense (2016)</li>
        <li>Certificaciones: PMP® (Project Management Professional), Scrum Master Certified (PSM II)</li>
      </ul>
      
      <h2>Competencias Clave</h2>
      <table>
        <tr>
          <th>Liderazgo y Gestión</th>
          <th>Técnicas y Herramientas</th>
          <th>Idiomas</th>
        </tr>
        <tr>
          <td>Agile / Scrum, Gestión de Presupuestos, Negociación</td>
          <td>Cloud Architecture, Python, TypeScript, SQL, Figma</td>
          <td>Español (Nativo), Inglés (C1 Avanzado)</td>
        </tr>
      </table>
    `,
  },
  {
    id: 'executive_report',
    name: 'Informe Ejecutivo de Gestión',
    description: 'Documento corporativo con resumen ejecutivo, tabla de KPIs y recomendaciones.',
    category: 'Negocios',
    previewColor: 'from-blue-700 to-indigo-900',
    defaultTitle: 'Informe Trimestral de Gestión',
    pageSize: 'letter',
    marginType: 'normal',
    content: `
      <h1 style="color: #1e3a8a;">INFORME DE GESTIÓN Y RENDIMIENTO OPERATIVO</h1>
      <p style="color: #64748b;"><strong>Periodo Evaluado:</strong> Tercer Trimestre (Q3) · <strong>Emitido por:</strong> Comité de Dirección</p>
      <hr>
      
      <h2>1. Resumen Ejecutivo</h2>
      <p>Durante el tercer trimestre, la organización alcanzó hitos estratégicos destacados con un incremento sostenido en la eficiencia de entrega y satisfacción del cliente. Las iniciativas de modernización han mostrado un retorno directo en la productividad del equipo y la reducción de incidentes críticos.</p>
      
      <blockquote>
        "La optimización de procesos y la adopción de herramientas colaborativas modernas consolidaron una mejora del 22% en el cumplimiento de objetivos estratégicos."
      </blockquote>
      
      <h2>2. Indicadores Clave de Desempeño (KPIs)</h2>
      <table>
        <tr>
          <th>Métrica de Rendimiento</th>
          <th>Meta Q3</th>
          <th>Resultado Real</th>
          <th>Variación</th>
        </tr>
        <tr>
          <td>Tasa de Retención de Clientes</td>
          <td>92.0%</td>
          <td>95.4%</td>
          <td>+3.4%</td>
        </tr>
        <tr>
          <td>Tiempo Medio de Resolución (MTTR)</td>
          <td>4.0 hrs</td>
          <td>2.8 hrs</td>
          <td>-30%</td>
        </tr>
        <tr>
          <td>Índice de Satisfacción (CSAT)</td>
          <td>88/100</td>
          <td>93/100</td>
          <td>+5 pts</td>
        </tr>
        <tr>
          <td>Eficiencia Presupuestaria</td>
          <td>100%</td>
          <td>104.2%</td>
          <td>+4.2%</td>
        </tr>
      </table>
      
      <h2>3. Conclusiones y Próximos Pasos</h2>
      <ol>
        <li>Expandir el modelo de automatización a las áreas de soporte y operaciones técnicas durante Q4.</li>
        <li>Presentar la propuesta de presupuesto consolidado para el ejercicio 2027 antes del 15 de diciembre.</li>
        <li>Realizar talleres de actualización continua para los líderes de departamento.</li>
      </ol>
    `,
  },
  {
    id: 'meeting_minutes',
    name: 'Minuta de Reunión de Trabajo',
    description: 'Registro de asistencia, orden del día, acuerdos y tabla de compromisos asignados.',
    category: 'General',
    previewColor: 'from-amber-600 to-orange-700',
    defaultTitle: 'Minuta de Reunión de Seguimiento',
    pageSize: 'letter',
    marginType: 'normal',
    content: `
      <h1>MINUTA DE REUNIÓN DE SEGUIMIENTO DE PROYECTO</h1>
      <p>
        <strong>Fecha:</strong> 10 de noviembre de 2026 &nbsp;|&nbsp; 
        <strong>Hora:</strong> 10:00 - 11:30 hrs &nbsp;|&nbsp; 
        <strong>Lugar / Sala:</strong> Sala Virtual Teams
      </p>
      
      <h2>1. Asistentes</h2>
      <ul>
        <li>Carlos Mendoza (Coordinador de Proyecto)</li>
        <li>Valeria Rivas (Especialista Técnica)</li>
        <li>Jorge Arismendi (Representante de Calidad)</li>
        <li>Lucía Domínguez (Secretaria Técnica)</li>
      </ul>
      
      <h2>2. Orden del Día</h2>
      <ol>
        <li>Revisión del estado de entregables del Sprint actual.</li>
        <li>Identificación de dependencias y riesgos operativos.</li>
        <li>Aprobación del calendario de pruebas integrales.</li>
      </ol>
      
      <h2>3. Acuerdos y Compromisos</h2>
      <table>
        <tr>
          <th>Acción / Tarea</th>
          <th>Responsable</th>
          <th>Fecha Límite</th>
          <th>Estado</th>
        </tr>
        <tr>
          <td>Enviar informe de pruebas de carga</td>
          <td>Valeria Rivas</td>
          <td>14 de nov</td>
          <td>En proceso</td>
        </tr>
        <tr>
          <td>Actualizar matriz de riesgos compartida</td>
          <td>Carlos Mendoza</td>
          <td>12 de nov</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>Validar firmas de conformidad con el cliente</td>
          <td>Jorge Arismendi</td>
          <td>18 de nov</td>
          <td>Pendiente</td>
        </tr>
      </table>
      
      <h2>4. Próxima Convocatoria</h2>
      <p>La siguiente sesión ordinaria tendrá lugar el <strong>17 de noviembre de 2026</strong> a las 10:00 hrs para evaluar el cierre de sprint.</p>
    `,
  },
  {
    id: 'project_proposal',
    name: 'Propuesta de Proyecto / Comercial',
    description: 'Documento estructurado con justificación, alcance, cronograma y presupuesto.',
    category: 'Académico',
    previewColor: 'from-purple-700 to-indigo-800',
    defaultTitle: 'Propuesta de Proyecto de Transformación',
    pageSize: 'a4',
    marginType: 'moderate',
    content: `
      <h1 style="color: #4338ca;">PROPUESTA TÉCNICA Y COMERCIAL DE PROYECTO</h1>
      <p style="color: #64748b;"><strong>Cliente Destinatario:</strong> Corporativo Andino &nbsp;|&nbsp; <strong>Versión:</strong> 1.0 Final</p>
      <hr>
      
      <h2>1. Antecedentes y Justificación</h2>
      <p>El mercado actual exige a las organizaciones modernas contar con plataformas interoperables, ágiles y con alta disponibilidad. La presente propuesta describe la solución integral diseñada para modernizar los flujos de gestión documental y colaboración en tiempo real.</p>
      
      <h2>2. Alcance del Proyecto</h2>
      <ul>
        <li><strong>Fase 1 (Diagnóstico):</strong> Levantamiento de requisitos y mapeo de flujos actuales (Semanas 1-2).</li>
        <li><strong>Fase 2 (Desarrollo &amp; Migración):</strong> Configuración del entorno de producción y migración de datos (Semanas 3-6).</li>
        <li><strong>Fase 3 (Capacitación y Puesta en Marcha):</strong> Formación de usuarios clave y acompañamiento de salida a producción (Semanas 7-8).</li>
      </ul>
      
      <h2>3. Inversión Estimada</h2>
      <table>
        <tr>
          <th>Concepto / Fase</th>
          <th>Dedicación Estimada</th>
          <th>Inversión (USD)</th>
        </tr>
        <tr>
          <td>Análisis, Arquitectura y Diagnóstico</td>
          <td>60 horas</td>
          <td>$3,600</td>
        </tr>
        <tr>
          <td>Implementación Técnica e Integración</td>
          <td>120 horas</td>
          <td>$7,200</td>
        </tr>
        <tr>
          <td>Pruebas de Calidad, Auditoría y Seguridad</td>
          <td>40 horas</td>
          <td>$2,400</td>
        </tr>
        <tr>
          <td>Capacitación y Soporte Post-Despliegue</td>
          <td>30 horas</td>
          <td>$1,800</td>
        </tr>
        <tr>
          <td><strong>Total Estimado del Proyecto</strong></td>
          <td><strong>250 horas</strong></td>
          <td><strong>$15,000</strong></td>
        </tr>
      </table>
      
      <h2>4. Condiciones de Aceptación</h2>
      <p>Los términos de esta propuesta tienen una validez de 30 días calendario a partir de su emisión. Para formalizar la orden de inicio, agradeceremos remitir la copia firmada de este documento.</p>
    `,
  },
];
