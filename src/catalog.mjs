export const categories = [
  { id: 'education', name: 'Education & Exams', icon: 'graduation-cap', color: '#3156a4', tint: '#edf0fc' },
  { id: 'career', name: 'Career & Business', icon: 'briefcase-business', color: '#a45d06', tint: '#fcf1dd' },
  { id: 'technology', name: 'Technology & Digital Skills', icon: 'code-xml', color: '#225e9b', tint: '#eaf3fd' },
  { id: 'health', name: 'Health & Wellness', icon: 'heart-pulse', color: '#b64246', tint: '#fff0ed' },
  { id: 'growth', name: 'Personal Development', icon: 'sprout', color: '#4b762a', tint: '#edf4e6' },
  { id: 'productivity', name: 'Productivity & Lifestyle', icon: 'layers-3', color: '#9c640c', tint: '#fff3dd' }
];
export const books = [
  ['jee-mains','JEE Mains Complete Preparation Guide','education','jee','Find a starting point for organising your exam preparation.','Students preparing for entrance exams'],
  ['digital-marketing','Digital Marketing for Beginners','career','marketing','Explore the language of online marketing and discover where to begin.','First-time marketers and entrepreneurs'],
  ['productivity-mastery','Productivity Mastery','productivity','productivity','Make space for focused work and the tasks that matter to you.','Students and busy professionals'],
  ['healthy-habits','Healthy Habits for a Better Life','health','habits','Explore everyday habits that fit into a busy routine.','Readers interested in everyday wellness'],
  ['ai-tools','AI Tools for Students & Professionals','technology','ai','Discover how digital tools can support study and everyday work.','Students and working professionals'],
  ['small-steps','Small Steps, Lasting Growth','growth',null,'Explore an approachable way to think about personal goals.','Readers interested in personal development']
].map(([slug,title,category,cover,description,audience]) => ({
  id: slug, slug, title, category, cover: cover && '/assets/' + cover + '.webp',
  description, audience, price: 299, sample: true, format: null, contents: null, outcomes: null, access: null
}));
export const categoryOf = book => categories.find(category => category.id === book.category);
export const money = amount => '₹' + amount.toLocaleString('en-IN');
export const faqs = [
  ['How do I buy an eBook?', 'Browse the collection, open a title and add it to your cart. You can review the checkout now. Sales will open when the final books and payment service are ready.'],
  ['How much does each eBook cost?', 'Each eBook is priced individually at ₹299. Your cart shows the total for the titles you select.'],
  ['Which payment methods can I use?', 'Payments are currently closed. Available payment methods will appear at checkout when sales open.'],
  ['How will I access my purchase?', 'The access method and delivery instructions will be listed on each product page before it goes on sale. Sample titles do not include downloadable files.'],
  ['Which devices are supported?', 'You can browse this shop on a phone, tablet or computer. Reading compatibility depends on the final file format and will be listed with each title.'],
  ['Can I request a refund?', 'Refund and cancellation terms are awaiting approval. They will be published before purchases are accepted.'],
  ['What if I need help with access?', 'Use the contact form and choose “Reading access”. Include the title and a description of the issue. Keep payment credentials out of your message.']
];

