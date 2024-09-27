using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class BorrowerLoanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
