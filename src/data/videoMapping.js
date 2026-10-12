/**
 * SignBridge - Central Video File Mapping
 * 
 * Maps normalized vocabulary keys to their exact verified video filenames.
 * Original source filenames are strictly preserved.
 * Video files are served from `/videos/<filename>` (public directory).
 */

export const VIDEO_MAPPINGS = {
  brother: 'brother__CISLR__00050__UDcg2skGRXM_1.mp4',
  come: 'come__CISLR__00025__HSEV-Y2g3A8.mp4',
  drink: 'drink__ISL500__00081__Drink__session106__clip016.mp4',
  eat: 'eat__CISLR__00016__Cgs1MibMXJ0.mp4',
  father: 'father__CISLR__00024__Gm2HCSz7Jqg_1.mp4',
  food: 'food__CISLR__00028__IVY4EYIVHMI.mp4',
  friend: 'friend__CISLR__00020__ElXP4DjT3H8_1.mp4',
  go: 'go__CISLR__00039__PQoocuBF2f8_1.mp4',
  goodbye: 'goodbye__CISLR__00036__O6YJgD20e2g.mp4',
  he: 'he__CISLR__00043__Qu5KH6X5dd8_1.mp4',
  hello: 'hello__ISL500__00087__Hello__session101__clip021.mp4',
  help: 'help__CISLR__00018__E91cfQBn8_4_1.mp4',
  home: 'home__CISLR__00008__3SRihi99gjc_1.mp4',
  hospital: 'hospital__CISLR__00057__Za7gQoC8eaA_1.mp4',
  market: 'market__CISLR__00079__zSXKZb2Frqc_1.mp4',
  me: 'me__CISLR__00006__1f6OchgCQrE.mp4',
  mother: 'mother__CISLR__00003__0t5NaJwemgI_1.mp4',
  no: 'no__CISLR__00015__CXEDTo1PXCg.mp4',
  okay: 'okay__CISLR__00019__EZpZvb2wicY.mp4',
  please: 'please__CISLR__00065__iGDJKo1-w5k.mp4',
  read: 'read__CISLR__00017__Dz2avlvSTYQ_1.mp4',
  school: 'school__CISLR__00038__OvDIlDiFmnU.mp4',
  she: 'she__CISLR__00013__BXw0xmFB8pQ_1.mp4',
  sister: 'sister__CISLR__00045__Rj6pX9wzxqA_1.mp4',
  sit: 'sit__CISLR__00007__2AGfP7x3obk_1.mp4',
  sorry: 'sorry__CISLR__00002__0sE5EMDNsDo.mp4',
  stand: 'stand__CISLR__00004__1GJkBoBf-S0_1.mp4',
  stop: 'stop__CISLR__00021__FEi50jcTxxI_1.mp4',
  student: 'student__CISLR__00056__Y66DFt19PyE.mp4',
  tea: 'tea__CISLR__00055__XqH46D16YDI_1.mp4',
  teacher: 'teacher__CISLR__00001__-PGXFLhDfS0_1.mp4',
  thank_you: 'thank_you__CISLR__00000__-4MbWP5T-cU.mp4',
  today: 'today__CISLR__00005__1XLi2MXWjGc_1.mp4',
  water: 'water__CISLR__00010__5FSC6Og1RBQ_2.mp4',
  what: 'what__CISLR__00009__4accXsYqRnA.mp4',
  when: 'when__CISLR__00069__mPZ37Qlg4B8.mp4',
  where: 'where__CISLR__00012__8wgrPnyzpMw.mp4',
  write: 'write__CISLR__00042__Qt7PxYKRi7c_1.mp4',
  yes: 'yes__CISLR__00033__LAT-u9Ww5ZU.mp4',
  you: 'you__CISLR__00040__QE4UkDB3MyE.mp4'
};

/**
 * Get video URL for a word key
 * @param {string} key Normalized word key (e.g., 'thank_you' or 'hello')
 * @returns {string|null} Resolved video path or null
 */
export function getVideoPath(key) {
  if (!key) return null;
  const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
  const filename = VIDEO_MAPPINGS[normalizedKey];
  return filename ? `/videos/${filename}` : null;
}
