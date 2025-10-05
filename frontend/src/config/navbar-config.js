// Navbar configuration for blr-home project
// This file allows easy customization of navbar elements

export const navbarConfig = {
  // Brand/logo configuration
  brand: {
    image: './assets/bear1.svg',
    link: '/',
    alt: 'Bear logo'
  },
  
  // Generic sections - can be dropdowns or direct links
  sections: [
    {
      type: 'dropdown',
      label: 'Projects',
      items: [
        { name: 'bowl-pickem', url: 'https://bowls.bearloves.rocks' },
        { name: 'bracket-revival', url: 'https://bracket.bearloves.rocks' },
        { name: 'budget-tracker', url: 'https://budget.bearloves.rocks' },
        { name: 'sat-finder', url: 'https://sats.bearloves.rocks' },
        { name: 'web-salad', url: 'https://salad.bearloves.rocks' },
        { name: 'blog', url: '/blog.html' }
      ]
    },
    {
      type: 'dropdown',
      label: 'About',
      items: [
        { name: 'The Name', url: '/name.html' },
        { name: 'The Projects', url: '/projects.html' },
        { name: 'The Author', url: '/author.html' }
      ]
    }
  ]
};