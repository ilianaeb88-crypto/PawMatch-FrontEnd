import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        home: 'home.html',
        adoptionChoice: 'adoption-choice.html',
        catWeight: 'cat-weight.html',
        catBreed: 'cat-breed.html',
        catHairLength: 'cat-hair-length.html',
        catActivityLevel: 'cat-activity-level.html',
        dogBreed: 'dog-breed.html',
        dogHairLength: 'dog-hair-length.html',
        dogActivityLevel: 'dog-activity-level.html',
        dogHypoallergenic: 'dog-hypoallergenic.html',
        dogType: 'dog-type.html',
        dogBarking: 'dog-barking.html',
        childrenOtherPets: 'children-other-pets.html',
        rankAnswers: 'rank-answers.html',
        questionnaireComplete: 'questionnaire-complete.html',
        matchResults: 'match-results.html',
        availablePets: 'available-pets.html',
        createAccount: 'create-account.html',
        signIn: 'sign-in.html',
        profile: 'profile.html',
        password: 'password.html',
        likedPets: 'liked-pets.html',
        notifications: 'notifications.html',
        petProfile: 'pet-profile.html',
        compatibility: 'compatibility.html',
      },
    },
  },
})
