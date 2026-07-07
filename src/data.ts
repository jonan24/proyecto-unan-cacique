export interface TimelineItem {
  year: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  infobox?: {
    [key: string]: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface Song {
  id: string;
  title: string;
  author: string;
  genre: string;
  lyrics: string;
  youtubeId?: string; // Integration or mock embed
  audioUrl?: string; // Simulated audio stream
  duration: string;
  description: string;
}

export const biographyData = {
  name: "Cacique Diriangén",
  image: "/assets/images/cacique_diriangen_hero_1783307374586.jpg",
  title: "Señor de las Tierras de los Dirianes",
  period: "Fl. 1523",
  birthPlace: "Meseta de los Pueblos, Nicaragua",
  epithet: "Padre de la Resistencia Indígena de Nicaragua",
  quote: "No nos someteremos a un dios extraño, ni a reyes lejanos. Esta tierra ha sido nuestra por generaciones y la defenderemos con nuestra sangre.",
  intro: "Diriangén fue un legendario cacique de la etnia Chorotega que gobernó el territorio de los Dirianes (región central de la actual Nicaragua). Es mundialmente recordado como el máximo exponente de la primera resistencia indígena organizada de América contra el expansionismo del Imperio Español en el año 1523.",
  historySection: {
    title: "El Choque de Dos Mundos (1523)",
    paragraphs: [
      "En abril de 1523, la expedición española comandada por el capitán Gil González Dávila penetró el Pacífico de Nicaragua. Tras interactuar pacíficamente y sostener complejos diálogos intelectuales con el Cacique Nicarao en el istmo de Rivas, los conquistadores continuaron su marcha hacia el norte, ingresando a los fértiles dominios del gran cacique Diriangén.",
      "El 14 de abril, Diriangén se presentó ante Gil González en una fastuosa procesión escoltada por quinientos hombres armados, diecisiete mujeres vestidas con planchas de oro y acompañados por músicos. Contrario a otros jefes, Diriangén rehusó someterse de inmediato o recibir el bautismo religioso. En su lugar, de manera estratégica, solicitó un plazo de tres días para consultar la propuesta con sus consejos de ancianos y sacerdotes.",
      "El 17 de abril de 1523, al expirar el plazo, Diriangén no regresó para arrodillarse, sino para luchar. Con un ejército estimado en más de 4,000 guerreros armados con macanas, arcos y flechas, lanzó una embestida implacable y coordinada contra los campamentos españoles en Diriamba. El combate fue feroz. Los españoles, a pesar de su superioridad tecnológica de acero, caballos y pólvora, sufrieron serios embates y se vieron obligados a emprender una precipitada retirada hacia el sur.",
      "Esta épica batalla marcó el primer rechazo armado y organizado a la conquista europea en suelo nicaragüense. Aunque las campañas coloniales subsecuentes lograron someter militarmente la región años más tarde, la gesta de Diriangén quedó grabada en el alma colectiva de los pueblos nicaragüenses como el símbolo supremo de la defensa de la soberanía, la libertad y el orgullo indígena ancestral."
    ]
  },
  legacy: {
    title: "Legado e Inmortalidad",
    content: "Hoy en día, el Cacique Diriangén es honrado oficialmente como Héroe Nacional de Nicaragua (Ley N.º 819 del año 2012). Su legado trasciende el tiempo y se manifiesta en la cultura viva de Nicaragua: en las danzas tradicionales como el Toro Guaco y el Güegüense en Diriamba (ciudad que lleva su nombre en honor al 'Señorío de Diriangén'), en la literatura revolucionaria y patriótica, y en la inquebrantable identidad mestiza del país que rechaza todo tipo de intervención extranjera."
  }
};

export const timelineItems: TimelineItem[] = [
  {
    year: "1523 (12 de Abril)",
    title: "La Expedición de Gil González",
    shortDescription: "Los españoles llegan al territorio costero del Pacífico nicaragüense.",
    fullDescription: "El capitán conquistador Gil González Dávila, al mando de una columna militar, llega a los ricos territorios del Pacífico nicaragüense desde Costa Rica. Tras bautizar a miles de indígenas en los dominios del Cacique Nicarao, avanza al norte en busca de más riquezas y sumisión de nuevos señoríos.",
    image: "/assets/images/cacique_diriangen_hero_1783307374586.jpg"
  },
  {
    year: "1523 (14 de Abril)",
    title: "El Solemne Encuentro en Diriamba",
    shortDescription: "El Cacique Diriangén recibe a los extranjeros con un imponente séquito.",
    fullDescription: "Diriangén se encuentra con Gil González Dávila. El cacique aparece de forma majestuosa con 500 guerreros, cargados de regalos de oro valorados en miles de pesos. Con gran dignidad política, rechaza el requerimiento inmediato de bautismo y sumisión al Rey de España, solicitando tres días de tregua para meditar la respuesta en consejo.",
    image: "/assets/images/cacique_diriangen_hero_1783307374586.jpg"
  },
  {
    year: "1523 (17 de Abril)",
    title: "La Batalla del No Retorno",
    shortDescription: "Emboscada masiva y retirada de las fuerzas españolas.",
    fullDescription: "Diriangén encabeza la primera gran sublevación armada del continente contra la invasión europea. Cuatro mil intrépidos guerreros dirianes caen sobre las huestes españolas. El encarnizado combate en los valles del actual Carazo causa estragos en los invasores y detiene en seco la marcha de Gil González, quien ordena la retirada estratégica hacia sus navíos en el Golfo de Nicoya.",
    image: "/assets/images/cacique_diriangen_hero_1783307374586.jpg"
  },
  {
    year: "Siglos XVI - XIX",
    title: "Preservación del Carácter Indómito",
    shortDescription: "Las rebeliones indígenas continuas inspiradas en la gesta de Diriangén.",
    fullDescription: "A lo largo de la dominación colonial, la Meseta de los Pueblos (Diriamba, Masaya, Jinotepe, Nindirí) fue foco de frecuentes levantamientos. La memoria del 'Cacique Guerrillero' sirvió de antorcha moral para las comunidades indígenas que lucharon por conservar sus tierras comunales, sus cabildos tradicionales y su libertad frente a las encomiendas españolas.",
    image: "/assets/images/cacique_diriangen_hero_1783307374586.jpg"
  },
  {
    year: "Siglos XX - XXI",
    title: "Héroe Nacional y Símbolo Revolucionario",
    shortDescription: "Reconocimiento patriótico y oficial en el Estado moderno.",
    fullDescription: "En la Nicaragua contemporánea, Diriangén es rescatado como la raíz primera del antiimperialismo y el nacionalismo. La Revolución Popular Sandinista y los movimientos de reivindicación histórica entronizan su figura. Finalmente, en el año 2012, la Asamblea Nacional lo declara oficialmente 'Héroe Nacional de Nicaragua' mediante la Ley N.º 819, eternizando su lucha en el currículo escolar y el honor patrio.",
    image: "/assets/images/diriangen_statue_1783307386213.jpg"
  }
];

export const encyclopediaArticles: Article[] = [
  {
    id: "diriangen",
    title: "Cacique Diriangén",
    category: "Líderes Históricos",
    summary: "El máximo héroe de la resistencia chorotega frente a la expedición española de Gil González Dávila en 1523.",
    content: "Diriangén fue un monarca o cacique nicaragüense del grupo étnico Chorotega, señor de las ricas y pobladas mesetas centrales conocidas como los Dirianes. Su liderazgo militar y político brilló al coordinar la primera resistencia armada coordinada contra la incursión española en Centroamérica. Se distinguió por su astucia diplomática al pedir un plazo de tres días que utilizó para agrupar sus contingentes militares de varios poblados circunvecinos, logrando infligir un golpe asombroso a los invasores.",
    infobox: {
      "Nombre Completo": "Diriangén (Señor de los Cerros o de las Alturas)",
      "Nacimiento": "Desconocido (Fines del Siglo XV)",
      "Fallecimiento": "Circa 1523-1525 (En combate o retirada en las serranías)",
      "Etnia/Pueblo": "Chorotega / Dirianes",
      "Rango": "Cacique Principal / Señor de la Meseta de los Pueblos",
      "Hecho Clave": "Lideró la Batalla del 17 de abril de 1523 contra Gil González Dávila.",
      "Reconocimiento": "Héroe Nacional de Nicaragua (Ley N.º 819, 2012)"
    }
  },
  {
    id: "dirianes",
    title: "Los Dirianes",
    category: "Pueblos Originarios",
    summary: "Subgrupo chorotega que habitaba la fértil Meseta de los Pueblos en la Nicaragua precolombina.",
    content: "Los Dirianes (vocablo que deriva del náhuatl 'diria', que significa 'de las colinas' o 'de las alturas') eran una rama de la gran migración de origen mesoamericano (Chorotegas) que se asentó en las tierras altas del suroeste de Nicaragua, en los actuales departamentos de Masaya, Carazo, Granada y partes de Managua. Eran notables agricultores de maíz, frijol, cacao y frutas, poseedores de una sofisticada teocracia sacerdotal, destacados tejedores y reconocidos artistas de la cerámica policromada de alta calidad, caracterizada por motivos zoomorfos y de deidades mesoamericanas.",
    infobox: {
      "Familia Lingüística": "Oto-mangue (Chorotega)",
      "Ubicación Geográfica": "Meseta de los Pueblos (Carazo, Masaya, Managua meridional)",
      "Ciudades Clave": "Diriamba, Jinotepe, Nindirí, Masatepe, Niquinohomo",
      "Principales Actividades": "Agricultura intensiva, comercio regional, alfarería artística",
      "Organización Política": "Confederación de cacicazgos autónomos con consejos de ancianos"
    }
  },
  {
    id: "nicarao",
    title: "Cacique Nicarao",
    category: "Líderes Históricos",
    summary: "Soberano de los Nahuas o Nicaraos del istmo de Rivas, famoso por sus diálogos filosóficos con los conquistadores.",
    content: "Nicarao (también conocido históricamente por algunos cronistas como Nicaragua o Macuilmiquiztli) fue el gobernante principal del istmo de Rivas, habitado por el pueblo de filiación nahua (nicaraos). A diferencia de Diriangén, Nicarao entabló inicialmente una relación de diplomacia e intercambio intelectual con Gil González Dávila en abril de 1523. Sostuvo un diálogo sumamente famoso recogido por el cronista de Indias Andrés de Cereceda, donde inquirió inteligentemente a los españoles sobre temas teológicos, cosmogónicos y científicos: el origen de la luz, el diluvio universal, el fin del mundo, las estrellas y el misterio del alma.",
    infobox: {
      "Nombre Histórico": "Nicarao / Macuilmiquiztli ('Cinco Muertes')",
      "Etnia/Pueblo": "Nahua (Nicaraos)",
      "Territorio": "Istmo de Rivas (entre el Océano Pacífico y el Lago Cocibolca)",
      "Estilo Político": "Diplomacia deliberativa, indagación filosófica",
      "Encuentro Colonial": "Abril de 1523"
    }
  },
  {
    id: "armas",
    title: "Armamento Indígena Chorotega",
    category: "Cultura y Tecnología",
    summary: "Los instrumentos bélicos y tácticas de combate desarrolladas por los guerreros autóctonos.",
    content: "El ejército de Diriangén se enfrentó a los españoles utilizando armas forjadas con materiales locales de alta efectividad defensiva e instructores tácticos experimentados. El arma principal era la macana (un mazo pesado de madera dura con bordes incrustados de afiladas lascas de obsidiana o pedernal). También empleaban con extraordinaria destreza arcos de madera de guayacán con flechas cuyas puntas llevaban venenos de plantas o ponzoña de serpientes. Para el combate cuerpo a cuerpo usaban lanzas largas y porras de piedra pulida. La defensa personal se basaba en petos protectores de algodón acolchado sumergido en salmuera (que amortiguaba golpes de flechas) y escudos redondos confeccionados con sólidas cañas y cueros de jaguar o venado.",
    infobox: {
      "Armas de Choque": "Macanas (obsidiana/pedernal), porras de piedra pulida, lanzas",
      "Armas de Proyectil": "Arcos de guayacán, flechas envenenadas, hondas de pita",
      "Armaduras Autóctonas": "Ichcahuipilli (chalecos de algodón acolchados con sal)",
      "Estrategia Preferida": "Emboscada coordinada, ataques en masa envolventes, repliegue táctico"
    }
  },
  {
    id: "rutas",
    title: "Ruta de la Conquista (1523)",
    category: "Eventos Históricos",
    summary: "El derrotero geográfico seguido por los españoles en el descubrimiento e invasión de Nicaragua.",
    content: "La expedición de 1523 inició en Panamá. Gil González Dávila navegó por el Pacífico hacia el golfo de Nicoya (Costa Rica). Desde allí, continuaron a pie hacia el norte. Entraron a territorio nicaragüense por el istmo de Rivas, bordeando las costas del imponente Gran Lago de Nicaragua (Cocibolca), al cual llamaron 'Mar Dulce'. Tras interactuar con los Nicaraos, la columna exploradora marchó hacia el interior montañoso de la meseta (Diriamba, Jinotepe, Masaya), donde chocaron de frente con el señorío de Diriangén. Tras el combate de abril, los españoles sobrevivientes huyeron apresuradamente de vuelta al istmo de Rivas y de allí reembarcaron a Panamá para reportar sus valiosos descubrimientos de oro.",
    infobox: {
      "Punto de Partida": "Panamá (Enero de 1523)",
      "Líder de Expedición": "Capitán Gil González Dávila",
      "Piloto Mayor": "Andrés Niño (quien cartografió el Golfo de Fonseca)",
      "Límite Norte Alcanzado": "Territorios de Diriangén (Actual departamento de Carazo)",
      "Destino de Retorno": "Golfo de Nicoya y posteriormente Panamá"
    }
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: "El Cacique Diriangén liderando a sus guerreros",
    description: "Óleo histórico que ilustra la imponente presencia de Diriangén al mando de los ejércitos chorotegas en su avance contra la expedición española en 1523.",
    image: "/assets/images/cacique_diriangen_hero_1783307374586.jpg",
    category: "Pinturas"
  },
  {
    id: "gal-2",
    title: "Monumento al Cacique Diriangén",
    description: "Soberbia escultura de bronce erigida en Diriamba, Carazo, que inmortaliza el espíritu indomable y heroico del líder de la resistencia indígena.",
    image: "/assets/images/diriangen_statue_1783307386213.jpg",
    category: "Esculturas"
  },
  {
    id: "gal-3",
    title: "Rincón Colonial y Canto de Patria",
    description: "El espíritu de la música nicaragüense, evocando la mezcla de la guitarra española y los ritmos ancestrales de la marimba de arco en los patios coloniales.",
    image: "/assets/images/revolutionary_music_guitar_1783307397450.jpg",
    category: "Cultura"
  },
  {
    id: "gal-4",
    title: "Basílica de San Sebastián, Diriamba",
    description: "La hermosa basílica de Diriamba, centro espiritual e histórico de la Meseta de los Pueblos, donde convergen las danzas del Toro Guaco y el Güegüense.",
    image: "/assets/images/cacique_diriangen_hero_1783307374586.jpg",
    category: "Sitios Históricos"
  },
  {
    id: "gal-5",
    title: "El Volcán Mombacho en Granada",
    description: "Espectacular coloso volcánico que vigilaba las fértiles llanuras donde habitaban los Dirianes y los pueblos indígenas del Gran Lago de Nicaragua.",
    image: "/assets/images/cacique_diriangen_hero_1783307374586.jpg",
    category: "Geografía"
  },
  {
    id: "gal-6",
    title: "Artesanía Tradicional Chorotega",
    description: "Cerámica policromada contemporánea elaborada en San Juan de Oriente, heredera directa de los diseños ancestrales que comerciaba el señorío de los Dirianes.",
    image: "/assets/images/cacique_diriangen_hero_1783307374586.jpg",
    category: "Cultura"
  }
];

export const songsData: Song[] = [
  {
    id: "song-1",
    title: "Nicaragua, Nicaragüita",
    author: "Carlos Mejía Godoy",
    genre: "Música Testimonial / Regional",
    duration: "4:02",
    description: "Considerada el segundo himno de Nicaragua. Expresa el inmenso amor y la devoción hacia la patria, comparando su dulzura con la miel de colmena y retratando el anhelo de libertad.",
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
    audioUrl: "https://folkcloud.com/uploads/Nicaragua/37f58fff-ed13-422c-8677-f78f7fc6795b.mp3" // Simulated audio stream
  },
  {
    id: "song-2",
    title: "La Tumba del Guerrillero",
    author: "Carlos Mejía Godoy y los de Palacagüina",
    genre: "Canto Testimonial Revolucionario",
    duration: "3:35",
    description: "Una de las piezas más sublimes y emotivas del cancionero revolucionario sandinista. Relata con poesía campesina el misterio de la tumba de un héroe anónimo en la montaña nicaragüense.",
    lyrics: `¿Dónde está la tumba del guerrillero?
Pregunta el viento de la montaña,
¿Dónde está el cuerpo de aquel muchacho
Que se marchó una mañana?

No busqués tumba en el cementerio,
No busqués fosa de mármol frío,
Que su cuerpo está sembrado en el cerro,
En la corriente de nuestro río.

Él está en la milpa floreciente,
En el canto alegre del jilguero,
En la sonrisa del niño tierno,
Ahí está vivo tu guerrillero.

La montaña guarda su secreto,
La neblina besa su vereda,
Y en cada pino que silba al viento
Un canto de libertad queda.

¿Dónde está la tumba del guerrillero?
Pregunta el viento de la montaña...`,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "song-3",
    title: "El Grito del Bolo",
    author: "Folclore Tradicional Nicaragüense",
    genre: "Son de Toro / Marimba de Arco",
    duration: "2:45",
    description: "Música alegre tradicional que brota de la marimba de arco de Masaya. Representa los ritmos mestizos y de las cofradías que acompañan las fiestas patronales nicaragüenses.",
    lyrics: `(Instrumental alegre ejecutado con Marimba de Arco de tres teclados, guitarra, guitarrilla y el grito festivo del campesino nicaragüense)

¡Juipipía! ¡Viva Masaya!
¡Viva la cuna del folclor!

El Grito del Bolo es un son tradicional que recoge el júbilo de las danzas populares. No posee una letra lírica estricta, sino exclamaciones de orgullo, silbidos rítmicos y el repique de las marimbas de madera de chiquirín que evocan la alegría del indígena en rebeldía contra la solemnidad colonial.`,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "song-4",
    title: "El Toro Guaco (Danza Ancestral)",
    author: "Tradicional de Diriamba",
    genre: "Música de Pito y Tambor",
    duration: "5:10",
    description: "La música que acompaña la danza representativa de Diriamba. Expresa de forma dramática el choque cultural: los bailarines visten máscaras de conquistadores españoles con humor burlesco.",
    lyrics: `(Melodía ancestral interpretada por el flautista de Pito de Caña y el ejecutor del Tambor de cuero de venado)

El Toro Guaco es la danza de resistencia cultural más antigua de Nicaragua. Los promesantes bailan ordenados en dos grupos imitando las jerarquías coloniales, mientras un toro simulado embiste a los participantes.

Su música de pito y tambor data de raíces precolombinas chorotegas, habiendo sobrevivido sin cambios en la meseta de Diriamba como un testimonio vivo de que el Cacique Diriangén y su pueblo siguen bailando con orgullo ante las máscaras extranjeras.`,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "song-5",
    title: "Allá Va el General",
    author: "Luis Enrique Mejía Godoy",
    genre: "Canto de Resistencia y Soberanía",
    duration: "3:18",
    description: "Canción dedicada al general de hombres libres, Augusto C. Sandino, heredero directo de la resistencia del Cacique Diriangén en las serranías de las Segovias.",
    lyrics: `Allá va, allá va, allá va el General
Con su sombrero alón de ala ancha
Cruzando las lomas de las Segovias,
Limpiando de yanquis nuestra patria.

Su bandera es roja y negra,
Su fusil es de esperanza,
El cacique Diriangén le cuida la espalda
Con flechas que silban venganza.

Sube, sube el General Sandino,
Campesinos le abren camino,
Con la guitarra en la mano izquierda
Y el machete labrando el destino.

Allá va, allá va, allá va el General
La patria entera le canta ya...`,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  }
];
