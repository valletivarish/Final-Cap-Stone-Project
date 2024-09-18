export class Helper {
  static getStoredRole() {
    return localStorage.getItem('role');
  }
  static getRoleLink(role,id, link = "") {
    switch (role) {
      case "admin":
        return `/admin-dashboard${link}`;
      case "employee":
        return `/employee-dashboard${link}`;
      case "agent":
        return `/agent-dashboard${link}`;
      case "customer":
        return `/customer-dashboard/${id}${link}`;
      default:
        return "/";
    }
  }
}