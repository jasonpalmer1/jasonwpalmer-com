// Web3Forms public access key — designed to live in client-side HTML.
// Submissions are relayed to the owner's inbox; the email address never
// appears anywhere on the page. Lock the key to jasonwpalmer.com in the
// Web3Forms dashboard to stop cross-origin spam.
export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
  "15d9048e-fd86-4578-8772-1d8a59525dce";
