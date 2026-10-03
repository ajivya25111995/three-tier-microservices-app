using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.Models;

namespace OrderService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly OrderDbContext _db;

    public OrdersController(OrderDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return Ok(await _db.Orders
            .OrderByDescending(x => x.Id)
            .ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await _db.Orders.FindAsync(id);

        if (order is null)
            return NotFound(new { message = "Order not found." });

        return Ok(order);
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders(int userId)
    {
        return Ok(await _db.Orders
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Id)
            .ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        if (order.UserId <= 0 ||
            string.IsNullOrWhiteSpace(order.ProductName) ||
            order.Quantity <= 0 ||
            order.UnitPrice < 0)
        {
            return BadRequest(new
            {
                message = "UserId, product name, positive quantity and non-negative price are required."
            });
        }

        order.Id = 0;
        order.CreatedAt = DateTime.UtcNow;

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateOrder(int id, Order input)
    {
        var order = await _db.Orders.FindAsync(id);

        if (order is null)
            return NotFound(new { message = "Order not found." });

        order.UserId = input.UserId;
        order.ProductName = input.ProductName;
        order.Quantity = input.Quantity;
        order.UnitPrice = input.UnitPrice;

        await _db.SaveChangesAsync();

        return Ok(order);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _db.Orders.FindAsync(id);

        if (order is null)
            return NotFound(new { message = "Order not found." });

        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
