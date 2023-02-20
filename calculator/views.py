from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from django.views.decorators.http import *
import numpy as np
import json
from calculator.models import LP, Calculation
from django.views.decorators.csrf import csrf_exempt

def remove_neg_zeroes(n):
    
    if n == -0:
        return 0
    else:
        return n
        
def mat_remove_neg_zeroes(n):
    return list(map(remove_neg_zeroes, n))
        
        

@csrf_exempt 
@require_POST  
def calculate_canonical(request):
    try:
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)
        basis = data['basis']
        
        
        #find new objective
        objective_vector = np.asarray(data['objective_vector'])
        A_matrix = np.asarray(data['A_matrix'])
        A_basis_transposed = []
        A_transposed = A_matrix.transpose()
        objective_basis_vector = []
        for i in basis:
            A_basis_transposed.append(A_transposed[i-1])
            objective_basis_vector.append(objective_vector[i-1])
        A_basis_transposed = np.asarray(A_basis_transposed)
        objective_basis_vector = np.asarray(objective_basis_vector)
        inv_A_basis_transposed = np.linalg.inv(A_basis_transposed)
        y_vector = np.matmul(inv_A_basis_transposed, objective_basis_vector)
        
        temp =  np.matmul(y_vector, A_matrix)
        new_objective_vector = np.around(np.subtract(objective_vector, temp), 5)
        new_objective_constant = np.around(np.add(np.asarray(data['objective_constant']), np.matmul(y_vector, np.asarray(data['constraint_constant']))), 5)
        if new_objective_constant == -0:
            new_objective_constant = 0
            
        #find new constraint
        inv_A_basis = inv_A_basis_transposed.transpose()
        new_A_matrix = np.around(np.matmul(inv_A_basis, A_matrix), 5)
        new_constraint_constant = np.around(np.matmul(inv_A_basis, np.asarray(data['constraint_constant'])), 5)
        
        input_lp = LP(lp = data)
        
        output_lp = LP(lp = {'objective_vector': np.ndarray.tolist(new_objective_vector), 'objective_constant': new_objective_constant, 'A_matrix': np.ndarray.tolist(new_A_matrix), 'constraint_constant': np.ndarray.tolist(new_constraint_constant)})
        
        
        history = Calculation(input_LP = input_lp, output_LP = output_lp)
        
        input_lp.save()
        output_lp.save()
        history.save()
        
        return JsonResponse({'objective_vector': list(map(remove_neg_zeroes, np.ndarray.tolist(new_objective_vector))), 'objective_constant': new_objective_constant, 'A_matrix': list(map(mat_remove_neg_zeroes, np.ndarray.tolist(new_A_matrix))), 'constraint_constant': list(map(remove_neg_zeroes, np.ndarray.tolist(new_constraint_constant)))})
    except:
        return HttpResponseBadRequest()

@require_GET
def get_history(request):
    history = Calculation.objects.all()[:5]
    hist_list = []
    for i in history:
        hist_list.append({"input": i.input_LP.lp, "output": i.output_LP.lp, "date": i.date})
    return JsonResponse({"list": hist_list})