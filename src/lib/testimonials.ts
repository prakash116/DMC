import { business } from "./business";

/*
 * REAL Google reviews only. Never add invented names, cars or quotes here.
 * To add one: copy the review text exactly as it appears on Google and fill the fields below.
 *   service — what the customer had done, if the review says so (otherwise null)
 *   date    — "YYYY-MM" the review was posted (otherwise null)
 */
export type Testimonial = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  service: string | null;
  date: string | null;
  sourceUrl: string;
};

const source = business.googleProfileUrl;

export const testimonials: Testimonial[] = [
  { name: "Aanjaneya Mehrotra", rating: 5, text: "Great price. Marvelous staff and end product.", service: null, date: null, sourceUrl: source },
  { name: "Jatin Bhardwaj", rating: 5, text: "Fantastic experience! Fully satisfied. Highly recommended.", service: null, date: null, sourceUrl: source },
  { name: "Vaibhav Sharma", rating: 5, text: "Great price.", service: null, date: null, sourceUrl: source },
  { name: "Ashutosh Rana", rating: 5, text: "Nice car washing experience.", service: null, date: null, sourceUrl: source },
];
