/** Persona card photos (Unsplash, resized to 900x1200). */
export const personaAssets = {
  // Bright modern apartment living room (Unsplash 1600607687939, 900 x 1200)
  renter: require('@/assets/images/personas/persona_renter.jpg'),
  landlord: require('@/assets/images/personas/persona_landlord.jpg'),
  manager: require('@/assets/images/personas/persona_manager.jpg'),
  addPersona: require('@/assets/images/personas/persona_add.jpg'),
};

/**
 * Round role photos on the Add Persona page (Unsplash, 240 x 240 crops):
 * agent = keys on a model house (1560518883), admin = analytics laptop
 * (1460925895917), manager = signing paperwork (1450101499163). The other
 * roles reuse the persona photos above.
 */
export const roleAssets = {
  landlord: personaAssets.landlord,
  manager: require('@/assets/images/personas/role_manager.jpg'),
  tenant: personaAssets.renter,
  pmsCompany: personaAssets.manager,
  agent: require('@/assets/images/personas/role_agent.jpg'),
  admin: require('@/assets/images/personas/role_admin.jpg'),
};
