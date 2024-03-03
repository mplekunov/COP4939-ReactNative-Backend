import { Sex } from "../../User/user";

export enum WaterSkiingAgeGroup {
    JR_BOYS,
    JR_GIRLS,
    BOYS,
    GIRLS,
    JR_MEN,
    JR_WOMEN,
    AMATEUR_WOMEN,
    MEN_I,
    MEN_II,
    MASTERS_MEN,
    MASTERS_WOMEN,
    VETERANS_MEN,
    VETERANS_WOMEN,
    PRO_MEN,
    PRO_WOMEN,
    OPEN_MEN,
    OPEN_WOMEN
}

export function getWaterskiAgeGroup(dateOfBirth: Date, sex: Sex, isPro: boolean, isOpen: boolean): WaterSkiingAgeGroup {
    let today = new Date();
    let currentYear = today.getFullYear();
    let birthYear = dateOfBirth.getFullYear();
    let age = currentYear - birthYear;
  
    if (sex === Sex.MALE) {
        return getWaterSkiingMaleAgeGroup(age, isPro, isOpen)
    } else if (sex === Sex.FEMALE) {
        return getWaterSkiingFemaleAgeGroup(age, isPro, isOpen)
    }
  
    throw new Error("Sex is not recognized."); 
}

function getWaterSkiingMaleAgeGroup(age: number, isPro: boolean, isOpen: boolean): WaterSkiingAgeGroup {
    if (isPro) {
        return WaterSkiingAgeGroup.PRO_MEN
    } else if (isOpen) {
        return WaterSkiingAgeGroup.OPEN_MEN
    } else if (age <= 9) {
        return WaterSkiingAgeGroup.JR_BOYS
    } else if (age <= 13) {
        return WaterSkiingAgeGroup.BOYS
    } else if (age <= 18) {
        return WaterSkiingAgeGroup.JR_MEN
    } else if (age <= 24) {
        return WaterSkiingAgeGroup.MEN_I
    } else if (age <= 29) {
        return WaterSkiingAgeGroup.MEN_II
    } else if (age <= 39) {
        return WaterSkiingAgeGroup.MASTERS_MEN
    } else if (age <= 65) {
        return WaterSkiingAgeGroup.VETERANS_MEN
    }


    throw new Error(`No age group is found for the age selected age: ${age}`)
}

function getWaterSkiingFemaleAgeGroup(age: number, isPro: boolean, isOpen: boolean): WaterSkiingAgeGroup {
    if (isPro) {
        return WaterSkiingAgeGroup.PRO_WOMEN
    } else if (isOpen) {
        return WaterSkiingAgeGroup.OPEN_WOMEN
    } else if (age <= 9) {
        return WaterSkiingAgeGroup.JR_GIRLS
    } else if (age <= 13) {
        return WaterSkiingAgeGroup.GIRLS
    } else if (age <= 18) {
        return WaterSkiingAgeGroup.JR_WOMEN
    } else if (age <= 29) {
        return WaterSkiingAgeGroup.AMATEUR_WOMEN
    } else if (age <= 39) {
        return WaterSkiingAgeGroup.MASTERS_WOMEN
    } else if (age <= 65) {
        return WaterSkiingAgeGroup.VETERANS_WOMEN
    }

    throw new Error(`No age group is found for the age selected age: ${age}`)
}