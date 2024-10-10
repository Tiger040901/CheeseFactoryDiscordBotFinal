export function getSecrets(selected_profile) {

    const secrets = selected_profile.data.dungeons.secrets_found;
    return secrets;
}

export function getCataLevel(selected_profile) {
    const level = selected_profile.data.dungeons.catacombs.level.level;
    return level;

}

export function getSelectedClass(selected_profile) {
    const selectedClass = selected_profile.data.dungeons.classes.selected_class;
    return selectedClass;
}

export function getMagicalPower(selected_profile) {
    const MagicPower = selected_profile.data.accessories.magical_power.total;
    return MagicPower;
}

export function getClassAverage(selected_profile) {
    const class_average = selected_profile.data.dungeons.classes.average_level;
    return class_average;
}

export function getCompletions(selected_profile) {
    const completions = selected_profile.data.dungeons.catacombs.completions;
    return completions;
}

export function getFloor7Completions(selected_profile) {
    try {
        const floor7Completions = selected_profile.data.dungeons.catacombs.floors[7].stats.tier_completions;
        return floor7Completions;
    } catch (error) {
        return 0;
    }
}

export function getFloor7PB(selected_profile) {
    try {
        const floor7PB = selected_profile.data.dungeons.catacombs.floors[7].stats.fastest_time_s_plus;
        return floor7PB;
    } catch (error) {
        return 0;
    }
}

export function getMaster3Completions(selected_profile) {
    try {
        const master3Completions = selected_profile.data.dungeons.master_catacombs.floors[3].stats.tier_completions;
        return master3Completions;
    } catch (error) {
        return 0;
    }
}

export function getMaster3PB(selected_profile) {
    try {
        const master3PB = selected_profile.data.dungeons.master_catacombs.floors[3].stats.fastest_time_s_plus;
        return master3PB;
    } catch (error) {
        return 0;
    }
}

export function getMaster4Completions(selected_profile) {
    try {
        const master4Completions = selected_profile.data.dungeons.master_catacombs.floors[4].stats.tier_completions;
        return master4Completions;
    } catch (error) {
        return 0;
    }
}

export function getMaster4PB(selected_profile) {
    try {
        const master4PB = selected_profile.data.dungeons.master_catacombs.floors[4].stats.fastest_time_s_plus;
        return master4PB;
    } catch (error) {
        return 0;
    }
}

export function getMaster5Completions(selected_profile) {
    try {
        const master5Completions = selected_profile.data.dungeons.master_catacombs.floors[5].stats.tier_completions;
        return master5Completions;
    } catch (error) {
        return 0;
    }
}

export function getMaster5PB(selected_profile) {
    try {
        const master5PB = selected_profile.data.dungeons.master_catacombs.floors[5].stats.fastest_time_s_plus;
        return master5PB;
    } catch (error) {
        return 0;
    }
}

export function getMaster6Completions(selected_profile) {
    try {
        const master6Completions = selected_profile.data.dungeons.master_catacombs.floors[6].stats.tier_completions;
        return master6Completions;
    } catch (error) {
        return 0;
    }
}

export function getMaster6PB(selected_profile) {
    try {
        const master6PB = selected_profile.data.dungeons.master_catacombs.floors[6].stats.fastest_time_s_plus;
        return master6PB;
    } catch (error) {
        return 0;
    }
}

export function getMaster7Completions(selected_profile) {
    try {
        const master7Completions = selected_profile.data.dungeons.master_catacombs.floors[7].stats.tier_completions;
        return master7Completions;
    } catch (error) {
        return 0;
    }
}

export function getMaster7PB(selected_profile) {
    try {
        const master7PB = selected_profile.data.dungeons.master_catacombs.floors[7].stats.fastest_time_s_plus;
        return master7PB;
    } catch (error) {
        return 0;
    }
}

