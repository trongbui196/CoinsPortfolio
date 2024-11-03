using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.ComponentModel;
using System.Linq;
using System.Runtime.Serialization;

public class EnumSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type.IsEnum)
        {
            var enumType = context.Type;
            schema.Enum.Clear();
            foreach (var enumValue in Enum.GetValues(enumType))
            {
                var enumMember = enumType.GetMember(enumValue.ToString())
                    .First()
                    .GetCustomAttributes(false)
                    .OfType<EnumMemberAttribute>()
                    .FirstOrDefault();

                var description = enumMember?.Value ?? enumValue.ToString();
                schema.Enum.Add(new OpenApiString(description));
            }
        }
    }
}
