import { AdmissionController } from '../../controllers/admission.controller';

declare global {
  namespace Express {
    interface Request {
      admissionController: AdmissionController;
    }
  }
}