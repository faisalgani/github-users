// ResponseCode.ts (atau .js kalau tidak pakai TypeScript)

class Utility {
  static responseCode(code: number): boolean {
    console.log(code)
    let result = false;

    switch (code) {
      case 200:
        result = true;
        break;
      case 400:
      case 403:
      case 405:
        result = false;
        break;
      case 500:
      case 502:
      case 504:
        result = false;
        break;
      default:
        result = false;
    }

    return result;
  }
}

export default Utility;
