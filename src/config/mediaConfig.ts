// REFERENCIA DE RUTA: 
// 1. Dónde guardar físicamente los archivos:
//    - Las imágenes deben guardarse en la carpeta: 'public/assets/images/' (ej. 'public/assets/images/mi_imagen.jpg')
//    - Los archivos de música (audio) deben guardarse en la carpeta: 'public/assets/audio/' (ej. 'public/assets/audio/mi_cancion.mp3')
//    - Los archivos de agradecimiento institucional en: 'public/assets/institucional/'
// 
// 2. Cómo escribir la ruta interna en el código:
//    - Se debe escribir de forma absoluta desde la raíz pública, omitiendo la palabra 'public'.
//    - Ejemplo para imagen: "/assets/images/mi_imagen.jpg"
//    - Ejemplo para canción: "/assets/audio/mi_cancion.mp3"
//    - Ejemplo para institucional: "/assets/institucional/mi_bandera.png"
// 
// 3. Compatibilidad con 'npm run build':
//    - Al compilar con Vite, todo el contenido dentro de la carpeta 'public' se copia exactamente igual a la raíz
//      de la carpeta de distribución 'dist'. Por lo tanto, usar rutas absolutas como '/assets/...' garantiza
//      que los enlaces nunca se rompan en producción y funcionen perfectamente 100% fuera de línea (offline).

export interface LocalImage {
  id: string | number;
  title: string;
  category: string;
  description: string;
  // REFERENCIA DE RUTA: Ruta absoluta que inicia con '/' y busca dentro de 'public' (ej: '/assets/images/ejemplo.jpg')
  url: string;
}

export interface LocalAudioTrack {
  id: string | number;
  title: string;
  author: string;
  genre: string;
  duration: string;
  description: string;
  lyrics: string;
  // REFERENCIA DE RUTA: Ruta absoluta para audio local en 'public/assets/audio/' (ej: '/assets/audio/cancion.mp3')
  url: string;
}

export interface StudentMember {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  email: string;
  phone?: string;
  github?: string;
  // REFERENCIA DE RUTA: Foto del estudiante guardada en 'public/assets/images/estudiantes/' o '/src/assets/images/'
  url: string;
}

// ==========================================
// CENTRALIZACIÓN DE IMÁGENES LOCALES
// ==========================================
export const localImagesConfig: LocalImage[] = [
  {
    id: "img-diriangen-hero",
    title: "Cacique Diriangén Combatiendo",
    category: "Pinturas",
    description: "Pintura al óleo representando la heroica batalla del Cacique Diriangén frente a la columna invasora española en abril de 1523.",
    url: "/assets/images/cacique_diriangen_hero_1783307374586.jpg"
  },
  {
    id: "img-diriangen-statue",
    title: "Estatua Monumento a Diriangén",
    category: "Esculturas",
    description: "Monumento de bronce dedicado al Héroe Nacional Cacique Diriangén ubicado en la ciudad de Diriamba, Carazo.",
    url: "/assets/images/diriangen_statue_1783307386213.jpg"
  },
  {
    id: "img-guitarra-canto",
    title: "Guitarra y Canto Revolucionario",
    category: "Cultura",
    description: "Guitarra artesanal nicaragüense que evoca las melodías del cancionero popular y testimonial.",
    url: "/assets/images/revolutionary_music_guitar_1783307397450.jpg"
  },
  {
    id: "img-fsln-institucional",
    title: "Bandera FSLN y Emblema de UNAN-Managua",
    category: "Institucional",
    description: "Bandera Rojo y Negro de la Revolución junto al escudo académico de la Universidad Nacional Autónoma de Nicaragua.",
    url: "/assets/images/fsln_flag_emblem_1783401857230.jpg"
  },
  {
    id: "img-daniel-ortega",
    title: "Retrato del Comandante Daniel Ortega",
    category: "Institucional",
    description: "Retrato artístico del Comandante Presidente Daniel Ortega Saavedra, líder del Gobierno de Reconciliación y Unidad Nacional.",
    url: "/assets/images/daniel_ortega_portrait_1783401868995.jpg"
  }
  // FACILIDAD DE EXTENSIÓN: Para añadir una nueva imagen local, simplemente duplica la línea de abajo y rellena los datos:
  // { id: "img-nueva", title: "Título de la Imagen", category: "Categoría", description: "Descripción corta", url: "/assets/images/nueva_imagen.jpg" }
];

// ==========================================
// CENTRALIZACIÓN DE PISTAS DE AUDIO LOCALES
// ==========================================
export const localAudioTracksConfig: LocalAudioTrack[] = [
  {
    id: "audio-nicaraguita",
    title: "Nicaragua, Nicaragüita",
    author: "Carlos Mejía Godoy",
    genre: "Música Testimonial / Regional",
    duration: "4:02",
    description: "Considerada un himno sentimental de Nicaragua. Expresa el inmenso amor y la devoción hacia la patria, cantando a su flora, su gente y el anhelo inquebrantable de soberanía.",
    lyrics: `¡Ay, Nicaragua, Nicaragüita!
Recibe como prenda de amor
Este ramo de siemprevivas y jilinjoches
Que hoy florecen para vos

Cuando yo beso tu frente pura
Beso las perlas de tu sudor
Más dulcita que la frutita del tigüilote
Y el jocote tronador

¡Ay, Nicaragua, Nicaragüita!
Mi cogollito de pijibay
Mi pasión se enterró
En el surco de tu querencia
Como un granito de máiz

Es tu saliva alaste y dulcita
Como la savia del marañón
Que restaña con alegría, todos los días
Mi rebelde corazón
Que restaña con alegría, todos los días
Mi rebelde corazón

¡Ay, Nicaragua, Nicaragüita!
La flor más linda de mi querer
Abonada con la bendita Nicaragüita
Sangre de Diriangén

¡Ay, Nicaragua!, sos más dulcita
Que la mielita de tamagás
Pero ahora que ya sos libre, Nicaragüita
¡Yo te quiero mucho más!
Pero ahora que ya sos libre, Nicaragüita
¡Yo te quiero mucho más!.`,
    url: "https://folkcloud.com/uploads/Nicaragua/37f58fff-ed13-422c-8677-f78f7fc6795b.mp3" // Ruta simulada/remota o local ej: "/assets/audio/nicaraguita.mp3"
  }
  // FACILIDAD DE EXTENSIÓN: Para añadir una nueva canción local, simplemente duplica la línea de abajo y rellena los datos:
  // { id: "audio-cancion3", title: "Canción 3", author: "Artista", genre: "Género", duration: "3:30", description: "Breve descripción", lyrics: "Letra aquí...", url: "/assets/audio/cancion3.mp3" }
];

// ==========================================
// CENTRALIZACIÓN DE CRÉDITOS DE ESTUDIANTES
// ==========================================
export const studentGroupConfig: StudentMember[] = [
  {
    id: "student-1",
    name: "Jonathan Alexander Martínez Gómez",
    role: "Coordinador de Desarrollo & Arquitectura",
    bio: "Estudiante de la Escuela Preparatoria de la UNAN-Managua. Apasionado por el desarrollo de software, la programación en TypeScript y el rescate interactivo de nuestra historia patria.",
    email: "jonan2493@gmail.com",
    phone: "+505 8888-8888",
    github: "https://github.com",
    url: "/assets/images/student_placeholder_1783401881695.jpg" // REFERENCIA DE RUTA local o marcador de posición generado
  },
  {
    id: "student-2",
    name: "María Fernanda Rostrán Ruiz",
    role: "Diseño Gráfico & Contenido Histórico",
    bio: "Encargada de la recopilación biográfica de la resistencia indígena y del diseño visual de la plataforma, asegurando el respeto por la iconografía nacional.",
    email: "maria.rostran@ejemplo.com",
    phone: "+505 7777-7777",
    url: "/assets/images/student_placeholder_1783401881695.jpg" // REFERENCIA DE RUTA local o marcador de posición generado
  },
  {
    id: "student-3",
    name: "Carlos José Espinoza Leytón",
    role: "Especialista en Multimedia & Cancionero",
    bio: "Responsable de la digitalización y preparación del cancionero testimonial y revolucionario, logrando la optimización de audios para reproducción offline.",
    email: "carlos.espinoza@ejemplo.com",
    url: "/assets/images/student_placeholder_1783401881695.jpg" // REFERENCIA DE RUTA local o marcador de posición generado
  }
  // FACILIDAD DE EXTENSIÓN: Duplica las líneas de arriba para agregar más integrantes del grupo:
  // {
  //   id: "student-4",
  //   name: "Nombre Completo de Compañero",
  //   role: "Rol desempeñado",
  //   bio: "Breve biografía del estudiante y su aporte al proyecto.",
  //   email: "correo@ejemplo.com",
  //   url: "/src/assets/images/student_placeholder_1783401881695.jpg"
  // }
];
