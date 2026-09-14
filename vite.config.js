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
        catBreed: 'cat-breed.html',
        catHairLength: 'cat-hair-length.html',
        catActivityLevel: 'cat-activity-level.html',
        catHouseTraining: 'cat-house-training.html',
        catDisability: 'cat-disability.html',
        catHypoallergenic: 'cat-hypoallergenic.html',
        petGender: 'pet-gender.html',
        petAge: 'pet-age.html',
        petWeight: 'pet-weight.html',
        dogBreed: 'dog-breed.html',
        dogHairLength: 'dog-hair-length.html',
        dogActivityLevel: 'dog-activity-level.html',
        dogHouseTraining: 'dog-house-training.html',
        dogDisability: 'dog-disability.html',
        dogHypoallergenic: 'dog-hypoallergenic.html',
        dogType: 'dog-type.html',
        dogProtective: 'dog-protective.html',
        dogBarking: 'dog-barking.html',
        dogShedding: 'dog-shedding.html',
        children: 'children.html',
        otherPets: 'other-pets.html',
        rankAnswers: 'rank-answers.html',
        questionnaireComplete: 'questionnaire-complete.html',
        matchResults: 'match-results.html',
        availablePets: 'available-pets.html',
        createAccount: 'create-account.html',
        signIn: 'sign-in.html',
        petProfile: 'pet-profile.html',
        compatibility: 'compatibility.html',
      },
    },
  },
})
