import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        adoptionChoice: 'adoption-choice.html',
        petChoice: 'pet-choice.html',
        catGender: 'cat-gender.html',
        catAge: 'cat-age.html',
        catWeight: 'cat-weight.html',
        petGender: 'pet-gender.html',
        petAge: 'pet-age.html',
        petWeight: 'pet-weight.html',
        dogBreed: 'dog-breed.html',
      },
    },
  },
})
