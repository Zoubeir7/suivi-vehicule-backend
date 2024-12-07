import { creerDocument, afficherDocuments, afficherDocumentParId, mettreAJourDocument, supprimerDocument } from '../controllers/documentController.js';
import prisma from '../config/prisma.js';

describe('Document Controller Tests', () => {
  let mockRes;
  let mockReq;

  beforeEach(() => {
    mockRes = {
      status: jasmine.createSpy('status').and.returnThis(),
      json: jasmine.createSpy('json')
    };
    mockReq = {
      body: {},
      params: {}
    };
  });

  afterEach(() => {
    jasmine.clearAllMocks();
  });

  // Test de la création de document
  describe('creerDocument', () => {
    it('devrait créer un document avec succès', async () => {
      mockReq.body = {
        nom: 'Document Test',
        debut_validite: '2024-01-01',
        fin_validite: '2025-01-01',
        cout: 100,
        renouvellement: '2025-01-01',
        vehiculeId: 1,
        utilisateurId: 1
      };

      // Mock de la création du document dans Prisma
      prisma.document.create = jasmine.createSpy('create').and.returnValue({
        id: 1,
        ...mockReq.body
      });

      await creerDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Document 'Document Test' créé avec succès.",
        document: jasmine.objectContaining({
          id: 1,
          nom: 'Document Test',
          debut_validite: jasmine.any(Date),
          fin_validite: jasmine.any(Date),
          cout: 100,
          renouvellement: jasmine.any(Date),
          vehiculeId: 1,
          utilisateurId: 1
        })
      });
    });

    it('devrait retourner une erreur si l\'utilisateur est introuvable', async () => {
      mockReq.body = { utilisateurId: 999 };  // ID utilisateur inexistant

      prisma.utilisateur.findUnique = jasmine.createSpy('findUnique').and.returnValue(null);

      await creerDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Utilisateur avec ID 999 non trouvé.' });
    });
  });

  // Test de l'affichage des documents
  describe('afficherDocuments', () => {
    it('devrait récupérer tous les documents avec succès', async () => {
      const documentsMock = [{
        id: 1,
        nom: 'Document Test',
        utilisateur: { nom: 'Utilisateur Test' },
        vehicule: { marque: 'Marque Test' }
      }];

      prisma.document.findMany = jasmine.createSpy('findMany').and.returnValue(documentsMock);

      await afficherDocuments(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: '1 document(s) récupéré(s) avec succès.',
        documents: documentsMock
      });
    });

    it('devrait retourner une erreur si la récupération échoue', async () => {
      prisma.document.findMany = jasmine.createSpy('findMany').and.throwError('Database error');

      await afficherDocuments(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erreur lors de la récupération des documents.' });
    });
  });

  // Test de l'affichage d'un document par ID
  describe('afficherDocumentParId', () => {
    it('devrait récupérer un document par ID avec succès', async () => {
      mockReq.params.id = '1';
      const documentMock = {
        id: 1,
        nom: 'Document Test',
        utilisateur: { nom: 'Utilisateur Test' },
        vehicule: { marque: 'Marque Test' }
      };

      prisma.document.findUnique = jasmine.createSpy('findUnique').and.returnValue(documentMock);

      await afficherDocumentParId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Document avec ID 1 récupéré avec succès.',
        document: documentMock
      });
    });

    it('devrait retourner une erreur si le document est introuvable', async () => {
      mockReq.params.id = '999';  // ID document inexistant

      prisma.document.findUnique = jasmine.createSpy('findUnique').and.returnValue(null);

      await afficherDocumentParId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Document avec ID 999 non trouvé.' });
    });
  });

  // Test de la mise à jour du document
  describe('mettreAJourDocument', () => {
    it('devrait mettre à jour un document avec succès', async () => {
      mockReq.params.id = '1';
      mockReq.body = { nom: 'Document Updated' };

      const documentUpdatedMock = { id: 1, nom: 'Document Updated' };

      prisma.document.findUnique = jasmine.createSpy('findUnique').and.returnValue(documentUpdatedMock);
      prisma.document.update = jasmine.createSpy('update').and.returnValue(documentUpdatedMock);

      await mettreAJourDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Document avec ID 1 mis à jour avec succès.',
        document: documentUpdatedMock
      });
    });

    it('devrait retourner une erreur si le document à mettre à jour est introuvable', async () => {
      mockReq.params.id = '999';

      prisma.document.findUnique = jasmine.createSpy('findUnique').and.returnValue(null);

      await mettreAJourDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Document avec ID 999 non trouvé.' });
    });
  });

  // Test de la suppression du document
  describe('supprimerDocument', () => {
    it('devrait supprimer un document avec succès', async () => {
      mockReq.params.id = '1';

      prisma.document.findUnique = jasmine.createSpy('findUnique').and.returnValue({ id: 1 });
      prisma.document.delete = jasmine.createSpy('delete').and.returnValue({ id: 1 });

      await supprimerDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Document avec ID 1 supprimé avec succès.' });
    });

    it('devrait retourner une erreur si le document à supprimer est introuvable', async () => {
      mockReq.params.id = '999';

      prisma.document.findUnique = jasmine.createSpy('findUnique').and.returnValue(null);

      await supprimerDocument(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Document avec ID 999 non trouvé.' });
    });
  });
});
