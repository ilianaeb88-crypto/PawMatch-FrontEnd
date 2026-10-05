export const compatibilityProfiles = {
  milo: { name: "Milo", traits: { Breed: "Border Collie Mix", Age: "3 Years Old", Gender: "Male", Weight: "45 Pounds", Activity: "Very Active", Trained: "Yes", Disability: "Not Disabled", Sociability: "Social", Path: "Adoption", Children: "Good with children", Cats: "Good with cats", Dogs: "Good with dogs", Exercise: "high" } },
  luna: { name: "Luna", traits: { Breed: "Domestic Shorthair", Age: "2 Years Old", Gender: "Female", Weight: "8 Pounds", Activity: "Moderately Active", Trained: "Yes", Disability: "Not Disabled", Sociability: "Reserved", Path: "Adoption", Children: "Good with children", Cats: "Good with cats", Dogs: "Good with dogs", Exercise: "low" } },
  bear: { name: "Bear", traits: { Breed: "Corgi Mix", Age: "5 Years Old", Gender: "Male", Weight: "35 Pounds", Activity: "Moderately Active", Trained: "Yes", Disability: "Not Disabled", Sociability: "Social", Path: "Foster", Children: "Good with children", Cats: "Not good with cats", Dogs: "Good with dogs", Exercise: "low" } },
  cleo: { name: "Cleo", traits: { Breed: "Calico", Age: "4 Years Old", Gender: "Female", Weight: "9 Pounds", Activity: "Non-Active", Trained: "Yes", Disability: "Not Disabled", Sociability: "Reserved", Path: "Adoption", Children: "Not good with children", Cats: "Good with cats", Dogs: "Not good with dogs", Exercise: "low" } },
  sayana: { name: "Sayana", traits: { Breed: "Pug", Age: "2 Years Old", Gender: "Female", Weight: "16 Pounds", Activity: "Moderately Active", Trained: "Yes", Disability: "Not Disabled", Sociability: "Social", Path: "Adoption", Children: "Good with children", Cats: "Good with cats", Dogs: "Good with dogs", Exercise: "low" } },
};

const HOUSEHOLD_POINTS = 4;
const slug = (text) => String(text || "").trim().toLowerCase().replaceAll(" ", "-");
const rankPoints = (rank) => (rank >= 10 ? 2 : 16 - rank);

function buildAnswerDefinitions(petPrefix) {
  return [
    { label: "Gender", key: "selectedGender", values: { male: "Male", female: "Female", any: "No Preference" }, trait: "Gender" },
    { label: "Age", key: "selectedAge", values: { "less-than-6-months": "0-1 (Baby)", "1-3": "1-3 (Young)", "3-7": "3-7 (Adult)", "greater-than-7": "Greater than 7 (Senior)" }, trait: "Age" },
    { label: "Weight", key: petPrefix === "Cat" ? "selectedCatWeight" : "selectedWeight", format: (value) => `${value.replaceAll("greater-than-", "Greater than ")} Pounds`, trait: "Weight" },
    { label: "Breed", key: `selected${petPrefix}Breed`, trait: "Breed" },
    { label: "Hair Length", key: `selected${petPrefix}HairLength`, values: { "long-hair": "Long-Hair", "short-hair": "Short-Hair" }, trait: "Hair Length" },
    { label: "Activity Level", key: `selected${petPrefix}Activity`, values: { "very-active": "Very Active", "moderately-active": "Moderately Active", "non-active": "Non-Active", "no-preference": "No Preference" }, trait: "Activity" },
    { label: "House Training", key: `selected${petPrefix}HouseTraining`, values: { yes: "House Trained", no: "No Preference" }, trait: "Trained" },
    { label: "Disability", key: `selected${petPrefix}Disability`, values: { "not-disabled": "Not Disabled", "any-disability": "Any Disability" }, trait: "Disability" },
    ...(petPrefix === "Dog" ? [
      { label: "Dog Group", key: "selectedDogType", trait: "Dog Group" },
      { label: "Protectivity", key: "selectedDogProtective", values: { protective: "Protective", "not-protective": "Not Protective" }, trait: "Protectivity" },
      { label: "Barking", key: "selectedDogBarking", values: { "does-not-matter": "Barking Does Not Matter", "does-not-bark": "Low Barking" }, trait: "Barking" },
      { label: "Shedding", key: "selectedDogShedding", values: { "does-not-shed": "Does Not Shed", "shedding-does-not-matter": "Shedding Does Not Matter" }, trait: "Shedding" },
    ] : []),
    { label: "Personality", key: `selected${petPrefix}Personality`, values: { social: "Social", reserved: "Reserved", "no-preference": "No Preference" }, trait: "Sociability" },
  ];
}

function getAnswerLabel(definition, value) {
  if (definition.values && definition.values[value]) return definition.values[value];
  if (definition.format) return definition.format(value);
  return value.replaceAll("-", " ");
}

function isNoPreferenceAnswer(definition, value) {
  const normalizedValue = value.trim().toLowerCase();
  return normalizedValue === "any"
    || normalizedValue === "no-preference"
    || normalizedValue === "any-disability"
    || normalizedValue === "not-protective"
    || normalizedValue.endsWith("does-not-matter")
    || getAnswerLabel(definition, value).trim().toLowerCase() === "no preference";
}

function matchesAnswer(profile, comparison) {
  const { key, value } = comparison;
  const trait = profile.traits[comparison.trait];
  if (!trait) return false;
  if (key === "selectedGender") return slug(trait) === value;
  if (key === "selectedAge") {
    const age = parseFloat(trait);
    if (value === "less-than-6-months") return age < 0.5;
    if (value === "1-3") return age >= 1 && age < 3;
    if (value === "3-7") return age >= 3 && age <= 7;
    return age > 7;
  }
  if (key === "selectedCatWeight") {
    const weight = parseFloat(trait);
    if (Number.isNaN(weight)) return false;
    if (value === "greater-than-25") return weight > 25;
    const [minimum, maximum] = value.split("-").map(Number);
    return weight >= minimum && weight <= maximum;
  }
  if (key === "selectedWeight") {
    const sizeByRange = { "0-10": "small", "10-30": "small", "30-50": "medium", "50-70": "medium", "70-90": "large", "90-110": "large", "greater-than-110": "large" };
    const pounds = parseFloat(trait);
    const size = pounds <= 30 ? "small" : pounds <= 70 ? "medium" : "large";
    return sizeByRange[value] === size;
  }
  if (key.endsWith("Breed")) return trait.toLowerCase() === value.toLowerCase();
  if (key.endsWith("HouseTraining")) return value !== "yes" || trait === "Yes";
  if (key.endsWith("Disability")) return value !== "not-disabled" || trait === "Not Disabled";
  return slug(trait) === value;
}

export function getCompatibility(requestedPetId) {
  const petId = compatibilityProfiles[requestedPetId] ? requestedPetId : "milo";
  const profile = compatibilityProfiles[petId];
  const petPrefix = petId === "luna" || petId === "cleo" ? "Cat" : "Dog";
  const savedRanks = JSON.parse(localStorage.getItem("answerRanks") || "{}");
  const answerOf = (key) => localStorage.getItem(key);

  const comparisons = buildAnswerDefinitions(petPrefix)
    .map((definition) => ({ ...definition, value: answerOf(definition.key) }))
    .filter((comparison) => comparison.value
      && Object.prototype.hasOwnProperty.call(savedRanks, comparison.key)
      && !isNoPreferenceAnswer(comparison, comparison.value))
    .sort((first, second) => savedRanks[first.key] - savedRanks[second.key]);

  const pathAnswer = answerOf("selectedPath");
  const speciesAnswer = answerOf("selectedPet");
  const rows = [
    {
      answer: pathAnswer === "foster" ? "Foster" : "Adopt",
      points: 15,
      matched: slug(profile.traits.Path) === (pathAnswer === "adopt" ? "adoption" : "foster"),
      characteristic: profile.traits.Path,
      hidden: true,
    },
    {
      answer: speciesAnswer === "cat" ? "Cat" : "Dog",
      points: 15,
      matched: speciesAnswer === petPrefix.toLowerCase(),
      characteristic: petPrefix,
      hidden: true,
    },
  ];
  comparisons.forEach((comparison) => {
    rows.push({
      answer: getAnswerLabel(comparison, comparison.value),
      points: rankPoints(savedRanks[comparison.key]),
      matched: matchesAnswer(profile, comparison),
      characteristic: comparison.trait === "Trained" && profile.traits.Trained === "Yes" ? "House Trained" : profile.traits[comparison.trait],
    });
  });
  if (answerOf("selectedChildrenUnderTwelve") === "yes") {
    rows.push({ points: HOUSEHOLD_POINTS, matched: profile.traits.Children?.startsWith("Good"), answer: "Has Children 12 or Under", characteristic: profile.traits.Children });
  }
  const otherPets = answerOf("selectedOtherPets");
  if (otherPets === "cat" || otherPets === "dog-and-cat") {
    rows.push({ points: HOUSEHOLD_POINTS, matched: profile.traits.Cats?.startsWith("Good"), answer: "Owns a Cat", characteristic: profile.traits.Cats });
  }
  if (otherPets === "dog" || otherPets === "dog-and-cat") {
    rows.push({ points: HOUSEHOLD_POINTS, matched: profile.traits.Dogs?.startsWith("Good"), answer: "Owns a Dog", characteristic: profile.traits.Dogs });
  }
  const yardAnswer = answerOf("selectedYardOrWalks");
  if (yardAnswer && petPrefix === "Dog") {
    const yardLabels = { "500-or-greater": "500sqft or Greater Yard", "less-than-500": "Less than 500sqft Yard", "daily-walks": "Daily Walks", "weekly-walks": "Weekly Walks", both: "Large Yard and Frequent Walks", neither: "No Large Yard or Daily Walks" };
    const canExercise = ["500-or-greater", "daily-walks", "both"].includes(yardAnswer);
    const needsExercise = profile.traits.Exercise === "high" || profile.traits.Activity === "Very Active" || parseFloat(profile.traits.Weight) > 70;
    let characteristic = "Low exercise needs";
    if (needsExercise) characteristic = canExercise ? "Hyper/Large - Your Space or Walks Are a Match" : "Hyper/Large - Needs More Space or Daily Walks";
    rows.push({ points: HOUSEHOLD_POINTS, matched: !needsExercise || canExercise, answer: yardLabels[yardAnswer] || yardAnswer, characteristic });
  }

  rows.forEach((row) => {
    if (!row.characteristic) row.earned = row.points / 2;
    else row.earned = row.matched ? row.points : 0;
  });
  const earnedPoints = rows.reduce((sum, row) => sum + row.earned, 0);
  const totalPoints = rows.reduce((sum, row) => sum + row.points, 0);
  const percent = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return { petId, profile, rows, earnedPoints, totalPoints, percent };
}
