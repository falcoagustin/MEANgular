const bloodGroups = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-'
]

const plusRegex = /^\+[0-9]{2}\s[0-9]{3}\s[0-9]{4}\s[0-9]{3}$/;
const zeroRegex = /^00[0-9]{2}\s[0-9]{3}\s[0-9]{4}\s[0-9]{3}$/;

export class Donator {
  id: string;
  name: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  bloodGroup: string;
  xCoord: number;
  yCoord: number;
  ip: number;

  isValid(): Boolean {
    if (this.hasEmptyFields()) return false;
    if (!this.isValidEmail()) return false;
    if (!this.isValidBloodGroup()) return false;
    if (!this.isValidContactNumber()) return false;
    return true;
  }

  hasEmptyFields(): Boolean {
    return this.name === undefined
        || this.lastName === undefined
        || this.email == undefined
        || this.contactNumber == undefined
        || this.address == undefined
        || this.bloodGroup == undefined;
  }

  private isValidEmail(): Boolean {
    return this.email.includes('@') && this.email.includes('.');
  }

  private isValidBloodGroup(): Boolean {
    return bloodGroups.indexOf(this.bloodGroup.toUpperCase()) != -1;
  }

  private isValidContactNumber(): Boolean {
    return this.contactNumber.match(plusRegex) != null || this.contactNumber.match(zeroRegex) != null;
  }
}
