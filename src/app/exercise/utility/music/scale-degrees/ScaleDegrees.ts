import * as _ from 'lodash';
import { Key } from '../keys/Key';
import { Note } from 'tone/Tone/core/type/NoteUnits';
import { transpose } from '../transpose';
import { noteTypeToNote } from '../notes/noteTypeToNote';
import { getDistanceOfKeys } from '../keys/getDistanceOfKeys';
import { getNoteType } from '../notes/getNoteType';
import { Interval } from '../intervals/Interval';
import { mod } from '../../../../shared/ts-utility/mod';

export enum Accidental {
  Natural = '',
  Sharp = '#',
  Flat = 'b',
}
export type DiatonicScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;
// Each chromatic note is spelled once, for all enharmonic alternatives use EnharmonicScaleDegree
export type ScaleDegree = '1' | 'b2' | '2' | 'b3' | '3' | '4' | '#4' | '5' | 'b6' | '6' | 'b7' | '7';
// Contains enharmonic alternative to ScaleDegree's values
export type EnharmonicScaleDegree = ScaleDegree | 'b5' | '#5' | 'bb7' | '8' | '9' | '#9';

export type ChromaticScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export const scaleDegreeToChromaticDegree: Record<ScaleDegree, ChromaticScaleDegree> = {
  '1': 1,
  'b2': 2,
  '2': 3,
  'b3': 4,
  '3': 5,
  '4': 6,
  '#4': 7,
  '5': 8,
  'b6': 9,
  '6': 10,
  'b7': 11,
  '7': 12,
}

export const expandedScaleDegreeToChromaticDegree: Record<EnharmonicScaleDegree, ChromaticScaleDegree> = {
  ...scaleDegreeToChromaticDegree,
  'b5': 7,
  '#5': 9,
  'bb7': 10,
  '8': 13,
  '9': 15,
  '#9': 16,
}

export const chromaticDegreeToScaleDegree = _.invert(scaleDegreeToChromaticDegree) as Record<ChromaticScaleDegree, ScaleDegree>;

export function getNoteFromScaleDegree(key: Key, scaleDegree: ScaleDegree, octave: number = 4): Note {
  return noteTypeToNote(transpose(key, scaleDegreeToChromaticDegree[scaleDegree] - 1), octave);
}

export function getScaleDegreeFromNote(key: Key, note: Note): ScaleDegree {
  const chromaticDegree: ChromaticScaleDegree = mod(getDistanceOfKeys(getNoteType(note), key), Interval.Octave) + 1 as ChromaticScaleDegree;
  return chromaticDegreeToScaleDegree[chromaticDegree];
}

export function getDiatonicScaleDegreeWithAccidental(scaleDegree: ScaleDegree): {
  diatonicScaleDegree: DiatonicScaleDegree,
  accidental: Accidental,
} {
  const regexMatch: RegExpMatchArray | null = scaleDegree.match(/(b|#)?([1-7])/);
  if (!regexMatch) {
    throw new Error(`${scaleDegree} is not a valid scale degree`);
  }
  return {
    diatonicScaleDegree: +regexMatch[2] as DiatonicScaleDegree,
    accidental: regexMatch[1] as Accidental ?? Accidental.Natural,
  }
}
