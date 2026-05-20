/**
 * data/cursos.ts — barrel de re-exports
 * ──────────────────────────────────────────────────────────────────────────────
 * Los tipos y la función fetchCursos() viven en lib/payload.ts.
 * Este fichero se mantiene para compatibilidad con los imports existentes
 * de los componentes de curso (CourseIntro, CourseDirector, etc.).
 */
export type {
  ImgProps,
  IntroData,
  LearningItem,
  LearningData,
  DirectorStat,
  DirectorData,
  AcademyPhoto,
  AcademyData,
  CtaData,
  CursoData,
} from '../lib/payload'

export { fetchCursos, fetchCurso } from '../lib/payload'

