using System.Linq.Expressions;

namespace DAL.Interfaces;

public interface IGenericRepository<T> where T : class
{
    // Read operations
    Task<T> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression);
    Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> expression);

    // Write operations - KHÔNG tự động SaveChanges
    Task AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);
    void Update(T entity);
    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);

    // Helper methods
    Task<bool> ExistsAsync(Expression<Func<T, bool>> expression);
    Task<int> CountAsync(Expression<Func<T, bool>> expression = null);
    Task<IEnumerable<T>> GetPagedAsync(int page, int pageSize, Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null);
    Task<IEnumerable<T>> IncludeAsync(Expression<Func<T, object>> include);

    Task<int> SaveChangesAsync();
}