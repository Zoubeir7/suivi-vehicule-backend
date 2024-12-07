import prisma from '@prisma/client';

describe("Tests CRUD pour le modèle Utilisateur", () => {
  let utilisateurId;

  // Données de test
  const utilisateurData = {
    prenom: "John",
    nom: "Doe",
    telephone: "123456789",
    email: "johndoe@example.com",
    password: "securepassword",
    role: "ADMIN", 
    status: true,
  };

  // Créer un utilisateur avant les tests
  beforeAll(async () => {
    await prisma.$connect();
  });

  // Déconnecter Prisma après les tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("doit créer un utilisateur", async () => {
    const utilisateur = await prisma.utilisateur.create({
      data: utilisateurData,
    });
    utilisateurId = utilisateur.id;

    expect(utilisateur).toBeDefined();
    expect(utilisateur.prenom).toBe(utilisateurData.prenom);
    expect(utilisateur.nom).toBe(utilisateurData.nom);
    expect(utilisateur.email).toBe(utilisateurData.email);
    expect(utilisateur.telephone).toBe(utilisateurData.telephone);
    expect(utilisateur.role).toBe(utilisateurData.role);
  });

  it("doit récupérer un utilisateur par ID", async () => {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
    });

    expect(utilisateur).toBeDefined();
    expect(utilisateur.id).toBe(utilisateurId);
    expect(utilisateur.email).toBe(utilisateurData.email);
  });

  it("doit mettre à jour un utilisateur", async () => {
    const updatedData = { nom: "DoeUpdated", status: false };

    const utilisateur = await prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: updatedData,
    });

    expect(utilisateur).toBeDefined();
    expect(utilisateur.nom).toBe(updatedData.nom);
    expect(utilisateur.status).toBe(updatedData.status);
  });

  it("doit supprimer un utilisateur", async () => {
    const utilisateur = await prisma.utilisateur.delete({
      where: { id: utilisateurId },
    });

    expect(utilisateur).toBeDefined();
    expect(utilisateur.id).toBe(utilisateurId);

    // Vérifier que l'utilisateur n'existe plus
    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
    });

    expect(utilisateurExistant).toBeNull();
  });
});
